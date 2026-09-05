const pool = require("../config/db");

// =============================
// GET ALL STOCKS
// =============================
exports.getStocks = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        c.name AS category,
        p.price,
        p.stock_quantity,
        p.minimum_stock,
        p.unit,
        p.is_available
      FROM products p
      LEFT JOIN categories c
      ON p.category_id = c.id
      ORDER BY p.id ASC
    `);

    res.json(result.rows);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};