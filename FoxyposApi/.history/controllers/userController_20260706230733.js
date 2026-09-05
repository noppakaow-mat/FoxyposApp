const bcrypt = require("bcrypt");
const pool = require("../config/db");

// GET all users
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hash, role || "cashier"]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const result = await pool.query(
      `UPDATE users SET role=$1 WHERE id=$2 RETURNING id, name, email, role`,
      [role, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM users WHERE id=$1", [id]);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};