const pool = require("../Config/db");
const bcrypt = require("bcrypt");
const generateToken = require("../Config/generateToken");

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE username=$1",
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const user = result.rows[0];

        const match = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!match) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};