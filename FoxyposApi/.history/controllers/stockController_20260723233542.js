const pool = require("../config/db");

// ==========================
// GET ALL PRODUCTS
// ==========================
exports.getStocks = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        c.name AS category,
        p.price,
        p.image_url,
        p.stock_quantity,
        p.is_available
      FROM products p
      LEFT JOIN categories c
        ON p.category_id = c.id
      ORDER BY p.id ASC
    `);

    res.status(200).json(result.rows);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// ==========================
// GET PRODUCT BY ID
// ==========================
exports.getStockById = async (req, res) => {
  try {

    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

// ==========================
// CREATE PRODUCT
// ==========================
exports.createStock = async (req, res) => {
  try {

    const {
      category_id,
      name,
      price,
      image_url,
      is_complimentary,
      stock_quantity,
      is_available
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products
      (
        category_id,
        name,
        price,
        image_url,
        is_complimentary,
        stock_quantity,
        is_available
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        category_id,
        name,
        price,
        image_url,
        is_complimentary,
        stock_quantity,
        is_available
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

// ==========================
// UPDATE PRODUCT
// ==========================
exports.updateStock = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      category_id,
      name,
      price,
      image_url,
      is_complimentary,
      stock_quantity,
      is_available
    } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET
      category_id=$1,
      name=$2,
      price=$3,
      image_url=$4,
      is_complimentary=$5,
      stock_quantity=$6,
      is_available=$7
      WHERE id=$8
      RETURNING *
      `,
      [
        category_id,
        name,
        price,
        image_url,
        is_complimentary,
        stock_quantity,
        is_available,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};

// ==========================
// DELETE PRODUCT
// ==========================
exports.deleteStock = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM products
      WHERE id=$1
      RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json({
      message: "Product deleted successfully"
    });

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

// ==========================
// INCREASE STOCK
// ==========================
exports.increaseStock = async (req, res) => {

  try {

    const { id } = req.params;
    const { quantity } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET stock_quantity = stock_quantity + $1
      WHERE id = $2
      RETURNING *
      `,
      [quantity, id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};

// ==========================
// DECREASE STOCK
// ==========================
exports.decreaseStock = async (req, res) => {

  try {

    const { id } = req.params;
    const { quantity } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET stock_quantity = stock_quantity - $1
      WHERE id = $2
      RETURNING *
      `,
      [quantity, id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};