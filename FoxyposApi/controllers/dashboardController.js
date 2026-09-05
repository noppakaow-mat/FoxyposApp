const pool = require("../config/db");

// ==========================
// DASHBOARD SUMMARY
// ==========================
exports.getSummary = async (req, res) => {
  try {
    const todayRevenue = await pool.query(`
  SELECT COALESCE(SUM(total_amount),0) AS revenue
  FROM table_sessions
  WHERE status = 'completed'
  AND DATE(COALESCE(closed_at, opened_at)) = CURRENT_DATE
`);

    const monthRevenue = await pool.query(`
  SELECT COALESCE(SUM(total_amount),0) AS revenue
  FROM table_sessions
  WHERE status = 'completed'
  AND DATE_TRUNC(
      'month',
      COALESCE(closed_at, opened_at)
  ) = DATE_TRUNC('month', CURRENT_DATE)
`);

    const activeTables = await pool.query(`
      SELECT COUNT(*) AS total
      FROM table_sessions
      WHERE status = 'active'
    `);

    const todayOrders = await pool.query(`
      SELECT COUNT(*) AS total
      FROM orders
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    res.json({
      todayRevenue: Number(todayRevenue.rows[0].revenue),
      monthRevenue: Number(monthRevenue.rows[0].revenue),
      activeTables: Number(activeTables.rows[0].total),
      todayOrders: Number(todayOrders.rows[0].total),
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
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
        SUM(oi.quantity)::int AS sold,
        SUM(oi.quantity * p.price) AS revenue
      FROM order_items oi
      JOIN products p
        ON oi.product_id = p.id
      GROUP BY p.id, p.name
      ORDER BY sold DESC
      LIMIT 5
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// MONTHLY SALES
// ==========================
exports.getMonthlySales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        TO_CHAR(
          COALESCE(closed_at, opened_at),
          'Mon'
        ) AS month,

        SUM(total_amount) AS sales

      FROM table_sessions

      WHERE status = 'completed'

      GROUP BY
        DATE_PART(
          'month',
          COALESCE(closed_at, opened_at)
        ),
        TO_CHAR(
          COALESCE(closed_at, opened_at),
          'Mon'
        )

      ORDER BY
        DATE_PART(
          'month',
          COALESCE(closed_at, opened_at)
        )
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};