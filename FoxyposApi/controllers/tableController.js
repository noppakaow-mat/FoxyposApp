const pool = require("../config/db");
const QRCode = require("qrcode");

// =====================================
// GET TABLES
// =====================================
exports.getTables = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.id,
        t.table_number,
        t.status,
        ts.id AS session_id,
        ts.number_of_guests AS customer_count,
        bp.name AS package_name,
        bp.price_per_person,
        ts.subtotal,
        ts.vat_amount,
        ts.total_amount
      FROM "tables" t
      LEFT JOIN LATERAL (
        SELECT *
        FROM table_sessions
        WHERE table_sessions.table_id = t.id
          AND table_sessions.status = 'active'
        ORDER BY id DESC
        LIMIT 1
      ) ts ON true
      LEFT JOIN buffet_packages bp ON bp.id = ts.package_id
      ORDER BY t.id ASC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

// =====================================
// OPEN TABLE
// =====================================
exports.openTable = async (req, res) => {
  const client = await pool.connect();

  try {
    const { table_id, package_id, customer_count } = req.body;

    await client.query("BEGIN");

    // CHECK TABLE (Lock row ด้วย FOR UPDATE เพื่อป้องกันการเปิดโต๊ะซ้ำซ้อนพร้อมกัน)
    const tableResult = await client.query(
      `SELECT * FROM "tables" WHERE id = $1 FOR UPDATE`,
      [table_id]
    );

    if (tableResult.rows.length === 0) {
      throw new Error("Table not found");
    }

    if (tableResult.rows[0].status === "occupied") {
      throw new Error("Table already occupied");
    }

    // GET PACKAGE INFO
    const packageResult = await client.query(
      `SELECT * FROM buffet_packages WHERE id = $1`,
      [package_id]
    );

    if (packageResult.rows.length === 0) {
      throw new Error("Package not found");
    }

    const pack = packageResult.rows[0];

    // CALCULATE BILL
    const subtotal = Number(customer_count) * Number(pack.price_per_person);
    const vat = Number((subtotal * 0.07).toFixed(2));
    const total = Number((subtotal + vat).toFixed(2));

    // CREATE SESSION
    const session = await client.query(
      `
      INSERT INTO table_sessions (
        table_id, package_id, number_of_guests, package_price, 
        subtotal, vat_amount, total_amount, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
      RETURNING *
      `,
      [
        table_id,
        package_id,
        customer_count,
        pack.price_per_person,
        subtotal,
        vat,
        total
      ]
    );

    // UPDATE TABLE STATUS
    await client.query(
      `UPDATE "tables" SET status = 'occupied' WHERE id = $1`,
      [table_id]
    );

    await client.query("COMMIT");

    res.json({
      message: "Open table success",
      session: session.rows[0],
      qr_endpoint: `/api/tables/qr/${session.rows[0].id}`,
      calculation: {
        package: pack.name,
        price: pack.price_per_person,
        subtotal,
        vat,
        total
      }
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("OPEN TABLE ERROR:", err.message);
    res.status(400).json({
      message: err.message
    });
  } finally {
    client.release();
  }
};
// =====================================
// CREATE TABLE
// =====================================
exports.createTable = async (req, res) => {
  try {
    const { table_number } = req.body;

    if (!table_number) {
      return res.status(400).json({
        message: "Table number is required"
      });
    }

    const result = await pool.query(
      `
      INSERT INTO "tables" (table_number, status)
      VALUES ($1, 'available')
      RETURNING *
      `,
      [table_number]
    );

    res.status(201).json({
      message: "Create table success",
      table: result.rows[0]
    });

  } catch (err) {
    console.error("CREATE TABLE ERROR:", err.message);

    // เช็คกรณีใส่เลขโต๊ะซ้ำกัน (Unique Constraint Violation)
    if (err.code === "23505") {
      return res.status(400).json({
        message: "Table already exists"
      });
    }

    res.status(500).json({
      message: "Server Error"
    });
  }
};

// CHECKOUT TABLE
exports.checkoutTable = async (req, res) => {
  const client = await pool.connect();

  try {
    const { table_id } = req.body;
    await client.query("BEGIN");
    // 1. ปิด session
    await client.query(
      `
      UPDATE table_sessions
      SET status = 'completed'
      WHERE table_id = $1 AND status = 'active'
      `,
      [table_id]
    );
    // 2. คืนสถานะโต๊ะให้ว่าง
    await client.query(
      `
      UPDATE "tables"
      SET status = 'available'
      WHERE id = $1
      `,
      [table_id]
    );
    await client.query("COMMIT");
    res.json({
      message: "Checkout success"
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CHECKOUT ERROR:", err.message);
    res.status(500).json({
      message: "Server Error"
    });
  } finally {
    client.release();
  }

};

// GET QR FOR CUSTOMER MENU
exports.getSessionQr = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await pool.query(
      `SELECT ts.id, t.table_number
       FROM table_sessions ts
       JOIN "tables" t ON t.id = ts.table_id
       WHERE ts.id = $1 AND ts.status = 'active'`,
      [sessionId]
    );

    if (!session.rows.length) {
      return res.status(404).json({ message: "Active table session not found" });
    }

    // Set PUBLIC_BASE_URL to the LAN/production address when the POS is behind a proxy.
    const baseUrl = (process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
    const customerUrl = `${baseUrl}/customer-menu.html?sessionId=${encodeURIComponent(sessionId)}`;
    const qrCode = await QRCode.toDataURL(customerUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 320,
    });

    res.json({
      table_number: session.rows[0].table_number,
      session_id: Number(sessionId),
      customer_url: customerUrl,
      qr_code: qrCode,
    });
  } catch (err) {
    console.error("GET SESSION QR ERROR:", err);
    res.status(500).json({ message: "Could not generate QR code" });
  }
};

// GET RECEIPT
exports.getReceipt = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await pool.query(`
      SELECT 
        ts.id AS session_id,
        t.table_number,
        ts.number_of_guests,
        bp.name AS package_name,
        ts.subtotal,
        ts.vat_amount,
        ts.total_amount
      FROM table_sessions ts
      JOIN "tables" t ON t.id = ts.table_id
      JOIN buffet_packages bp ON bp.id = ts.package_id
      WHERE ts.id = $1
    `, [sessionId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// =====================================
// GET SESSION INFO
// =====================================
exports.getSessionInfo = async (req, res) => {
  try {

    const { sessionId } = req.params;

    const result = await pool.query(
      `
      SELECT
        ts.id AS session_id,
        t.table_number,
        ts.number_of_guests,
        bp.name AS package_name,
        bp.price_per_person,
        ts.subtotal,
        ts.vat_amount,
        ts.total_amount
      FROM table_sessions ts
      JOIN "tables" t
        ON t.id = ts.table_id
      JOIN buffet_packages bp
        ON bp.id = ts.package_id
      WHERE ts.id = $1
      `,
      [sessionId]
    );


    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Session not found"
      });
    }


    res.json(result.rows[0]);


  } catch (err) {
    console.error("GET SESSION INFO ERROR:", err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};