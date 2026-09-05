const pool = require("../Config/db");

// ============================================================================
// CREATE ORDER FROM CUSTOMER MENU
// ============================================================================
const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const io = req.app.get("io");
    const { items = [], sessionId } = req.body;

    if (!sessionId || !items.length) {
      return res.status(400).json({
        message: "Session and order items are required"
      });
    }

    await client.query("BEGIN");

    // ===================================
    // CHECK TABLE SESSION
    // ===================================
    const sessionResult = await client.query(
      `
      SELECT
        ts.id,
        ts.table_id,
        ts.opened_at AS session_created_at,
        t.table_number
      FROM table_sessions ts
      JOIN tables t ON t.id = ts.table_id
      WHERE ts.id = $1 AND ts.status = 'active'
      `,
      [sessionId]
    );

    if (!sessionResult.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Active table session not found"
      });
    }

    // ===================================
    // CREATE ORDER
    // ===================================
    const orderResult = await client.query(
      `
      INSERT INTO orders (table_session_id, status)
      VALUES ($1, 'pending')
      RETURNING id, created_at
      `,
      [sessionId]
    );

    const order = orderResult.rows[0];

    // ===================================
    // RUNNING ORDER NUMBER
    // ===================================
    const runningResult = await client.query(
      `
      SELECT COUNT(*) AS count
      FROM orders
      WHERE table_session_id = $1
      `,
      [sessionId]
    );

    const orderNumber = Number(runningResult.rows[0].count);
    const orderItems = [];

    // ===================================
    // INSERT ORDER ITEMS
    // ===================================
    for (const item of items) {
      const productId = item.product_id || item.id;
      const quantity = Number(item.quantity || item.qty || 0);

      if (!productId || quantity < 1) {
        throw new Error("Invalid order item");
      }

      const productResult = await client.query(
        `
        SELECT id, name, price, stock_quantity
        FROM products
        WHERE id = $1 AND is_available = true
        `,
        [productId]
      );

      if (!productResult.rows.length) {
        throw new Error(`Product ${productId} unavailable`);
      }

      const product = productResult.rows[0];

      if (product.stock_quantity < quantity) {
        throw new Error(`${product.name} stock not enough`);
      }

      await client.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price_each, subtotal)
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          order.id,
          product.id,
          quantity,
          product.price,
          Number(product.price) * quantity
        ]
      );

      orderItems.push({
        product_id: product.id,
        name: product.name,
        qty: quantity
      });
    }

    await client.query("COMMIT");

    const newOrder = {
      id: order.id,
      order_number: orderNumber,
      table_id: sessionResult.rows[0].table_id,
      table_number: sessionResult.rows[0].table_number,
      table_session_id: Number(sessionId),
      session_created_at: sessionResult.rows[0].session_created_at,
      status: "pending",
      created_at: order.created_at,
      items: orderItems
    };

    // ===================================
    // SOCKET KITCHEN
    // ===================================
    if (io) {
      io.emit("newOrder", newOrder);
    }

    res.status(201).json({
      message: "Order created",
      order: newOrder
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  } finally {
    client.release();
  }
};

// ============================================================================
// GET KITCHEN ORDERS
// ============================================================================
const getPendingOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        t.id AS table_id,
        t.table_number,
        ts.id AS table_session_id,
        ts.opened_at AS session_created_at,
        json_agg(
          json_build_object(
            'id', o.id,
            'order_number', (
              SELECT COUNT(*)
              FROM orders o2
              WHERE o2.table_session_id = o.table_session_id
              AND o2.created_at <= o.created_at
            ),
            'status', o.status,
            'created_at', o.created_at,
            'items', (
              SELECT json_agg(
                json_build_object(
                  'name', p.name,
                  'qty', oi.quantity
                )
              )
              FROM order_items oi
              JOIN products p ON p.id = oi.product_id
              WHERE oi.order_id = o.id
            )
          )
          ORDER BY o.created_at
        ) AS orders
      FROM orders o
      JOIN table_sessions ts ON ts.id = o.table_session_id
      JOIN tables t ON t.id = ts.table_id
      WHERE ts.status = 'active'
      AND o.status IN ('pending', 'served')
      GROUP BY t.id, t.table_number, ts.id, ts.opened_at
      ORDER BY t.table_number
      `
    );

    res.json(result.rows);
  } catch (err) {
    console.error("GET KITCHEN ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================================================================
// MARK ORDER SERVED
// ============================================================================
const markOrderServed = async (req, res) => {
  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    // ============================
    // ตรวจสอบ Order
    // ============================
    const orderResult = await client.query(
      `
      SELECT *
      FROM orders
      WHERE id=$1
      AND status='pending'
      `,
      [req.params.id]
    );

    if (!orderResult.rows.length) {

      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Order not found"
      });

    }

    // ============================
    // ดึงรายการสินค้า
    // ============================
    const itemResult = await client.query(
      `
      SELECT
        product_id,
        quantity
      FROM order_items
      WHERE order_id=$1
      `,
      [req.params.id]
    );

    // ============================
    // หัก Stock
    // ============================
    for (const item of itemResult.rows) {

      const stock = await client.query(
        `
        SELECT stock_quantity
        FROM products
        WHERE id=$1
        `,
        [item.product_id]
      );

      if (!stock.rows.length) {
        throw new Error("Product not found");
      }

      if (stock.rows[0].stock_quantity < item.quantity) {
        throw new Error("Stock not enough");
      }

      await client.query(
        `
        UPDATE products
        SET stock_quantity = stock_quantity - $1
        WHERE id=$2
        `,
        [
          item.quantity,
          item.product_id
        ]
      );

    }

    // ============================
    // เปลี่ยนสถานะ
    // ============================
    const result = await client.query(
      `
      UPDATE orders
      SET status='served'
      WHERE id=$1
      RETURNING id,status,created_at
      `,
      [req.params.id]
    );

    await client.query("COMMIT");

    const io = req.app.get("io");

    if (io) {

      io.emit("orderServed", {
        id: result.rows[0].id,
        status: "served"
      });

    }

    res.json({
      message: "Order served",
      order: result.rows[0]
    });

  } catch (err) {

    await client.query("ROLLBACK");

    console.error(err);

    res.status(500).json({
      message: err.message
    });

  } finally {

    client.release();

  }
};  

// ============================================================================
// GET CUSTOMER ORDER HISTORY
// ============================================================================
const getOrdersBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await pool.query(
      `
      SELECT
        o.id,
        (
          SELECT COUNT(*)
          FROM orders o2
          WHERE o2.table_session_id = o.table_session_id
          AND o2.created_at <= o.created_at
        ) AS order_number,
        o.status,
        o.created_at,
        json_agg(
          json_build_object(
            'id', p.id,
            'name', p.name,
            'qty', oi.quantity,
            'price', oi.price_each
          )
        ) AS items
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON p.id = oi.product_id
      WHERE o.table_session_id = $1
      GROUP BY o.id
      ORDER BY o.created_at ASC
      `,
      [sessionId]
    );

    res.json({
      success: true,
      orders: result.rows
    });
  } catch (err) {
    console.error("GET ORDER HISTORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "ไม่สามารถโหลดประวัติออเดอร์ได้"
    });
  }
};

module.exports = {
  createOrder,
  getPendingOrders,
  markOrderServed,
  getOrdersBySession
};