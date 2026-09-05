const bcrypt = require("bcrypt");
const pool = require("../config/db");

// GET all users
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, role, created_at
       FROM users
       ORDER BY id ASC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE user
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users
      (username, password_hash, role)
      VALUES ($1,$2,$3)
      RETURNING id, username, role, created_at`,
      [username, password_hash, role || "cashier"]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ROLE
exports.updateUserRole = async (req, res) => {
  try {

    const { id } = req.params;
    const { role } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET role = $1
       WHERE id = $2
       RETURNING id, username, role`,
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {

  try {

    const { id } = req.params;
    const { password } = req.body;

    const password_hash = await bcrypt.hash(password,10);

    await pool.query(
      `UPDATE users
       SET password_hash=$1
       WHERE id=$2`,
      [password_hash,id]
    );

    res.json({
      message:"Password updated successfully"
    });

  } catch(err){

    res.status(500).json({
      message:err.message
    });

  }

};

// DELETE USER
exports.deleteUser = async (req, res) => {

  try {

    const { id } = req.params;

    await pool.query(
      `DELETE FROM users
       WHERE id=$1`,
      [id]
    );

    res.json({
      message:"User deleted successfully"
    });

  } catch(err){

    res.status(500).json({
      message:err.message
    });

  }

};