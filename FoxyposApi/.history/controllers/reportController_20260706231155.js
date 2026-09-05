const pool = require("../config/db");

/**
 * KPI SUMMARY
 * /api/reports/kpi
 */
exports.getKPI = async (req, res) => {
  try {
    const sales = await pool.query(`
      SELECT COALESCE(SUM(total_amount),0) AS revenue
      FROM orders
      WHERE status = 'paid'
    `);

    const orders = await pool.query(`
      SELECT COUNT(*) AS total_orders
      FROM orders
      WHERE status = 'paid'
    `);

    const avg = await pool.query(`
      SELECT COALESCE(AVG(total_amount),0) AS avg_bill
      FROM orders
      WHERE status = 'paid'
    `);

    res.json({
      revenue: Number(sales.rows[0].revenue),
      total_orders: Number(orders.rows[0].total_orders),
      avg_bill: Number(avg.rows[0].avg_bill),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/**
 * DAILY SALES
 * /api/reports/daily
 */
exports.getDailySales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        DATE(created_at) AS date,
        SUM(total_amount) AS revenue
      FROM orders
      WHERE status = 'paid'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/**
 * MONTHLY SALES
 */
exports.getMonthlySales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        SUM(total_amount) AS revenue
      FROM orders
      WHERE status = 'paid'
      GROUP BY month
      ORDER BY month ASC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/**
 * TOP SELLING PRODUCTS
 */
exports.getTopProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.name,
        SUM(oi.quantity) AS total_sold
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      GROUP BY p.name
      ORDER BY total_sold DESC
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};