const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// =====================
// REGISTER
// =====================
exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        const userExists = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (username, password_hash, role)
             VALUES ($1, $2, $3)
             RETURNING id, username, role`,
            [username, hash, role || "cashier"]
        );

        res.json({
            message: "Register success",
            user: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// =====================
// LOGIN
// =====================
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login success",
            token
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};