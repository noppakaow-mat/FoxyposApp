const pool = require("../Config/db");

const loadCustomerMenu = async (sessionId, req) => {
  const session = await pool.query(
    `SELECT id FROM table_sessions WHERE id = $1 AND status = 'active'`,
    [sessionId]
  );

  if (!session.rows.length) return null;

  const menus = await pool.query(`
    SELECT
      p.id, p.name, p.price, p.image_url, p.is_complimentary,
      p.stock_quantity, p.is_available, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.is_available = true
    ORDER BY c.id, p.id
  `);

  const apiBaseUrl = `${req.protocol}://${req.get("host")}`;
  return menus.rows.map((menu) => ({
    ...menu,
    image_url: menu.image_url && !/^https?:\/\//i.test(menu.image_url)
      ? `${apiBaseUrl}${menu.image_url.startsWith("/") ? "" : "/"}${menu.image_url}`
      : menu.image_url,
  }));
};

exports.getCustomerMenu = async (req, res) => {
  try {
    const menus = await loadCustomerMenu(req.params.sessionId, req);
    if (!menus) return res.status(404).json({ message: "Table session not found" });
    res.json(menus);
  } catch (err) {
    console.error("GET CUSTOMER MENU ERROR:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Called by the customer page immediately after the QR URL is opened.
exports.scanCustomerMenu = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({
        message: "sessionId is required"
      });
    }
    const session = await pool.query(
      `
      SELECT
        ts.id,
        t.table_number
      FROM table_sessions ts
      JOIN "tables" t
        ON t.id = ts.table_id
      WHERE ts.id = $1
      `,
      [sessionId]
    );
    if (!session.rows.length) {
      return res.status(404).json({
        message: "Session not found"
      });
    }
    const menus = await loadCustomerMenu(
      sessionId,
      req
    );
    res.json({
      sessionId: Number(sessionId),
      table_number: session.rows[0].table_number,
      menus
    });
  } catch(err){
    console.error(err);
    res.status(500).json({
      message:"Server Error"
    });

  }
};
