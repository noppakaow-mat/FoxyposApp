const pool = require("../config/db");

// ==========================
// DASHBOARD SUMMARY
// ==========================
exports.getSummary = async (req, res) => {
  try {

    const todayRevenue = await pool.query(`
      SELECT
      COALESCE(SUM(amount),0) AS revenue
      FROM payments
      WHERE status='successful'
      AND DATE(paid_at)=CURRENT_DATE
    `);

    const monthRevenue = await pool.query(`
      SELECT
      COALESCE(SUM(amount),0) AS revenue
      FROM payments
      WHERE status='successful'
      AND DATE_TRUNC('month',paid_at)=DATE_TRUNC('month',CURRENT_DATE)
    `);

    const activeTables = await pool.query(`
      SELECT COUNT(*) AS total
      FROM table_sessions
      WHERE status='active'
    `);

    const todayOrders = await pool.query(`
      SELECT COUNT(*) AS total
      FROM orders
      WHERE DATE(created_at)=CURRENT_DATE
    `);

    res.json({
      todayRevenue: todayRevenue.rows[0].revenue,
      monthRevenue: monthRevenue.rows[0].revenue,
      activeTables: activeTables.rows[0].total,
      todayOrders: todayOrders.rows[0].total
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};
// ==========================
// TOP PRODUCTS
// ==========================
exports.getTopProducts = async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
      p.name,
      SUM(oi.quantity) AS total_quantity
      FROM order_items oi
      JOIN products p
      ON oi.product_id=p.id
      GROUP BY p.id,p.name
      ORDER BY total_quantity DESC
      LIMIT 5
    `);

    res.json(result.rows);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};