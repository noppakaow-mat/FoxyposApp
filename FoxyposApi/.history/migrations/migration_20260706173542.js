const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const runMigrations = async () => {
    try {
        const sql = fs.readFileSync(
            path.join(__dirname, data.sql"),
            "utf-8"
        );

        await pool.query(sql);

        console.log("🟢 Migration completed successfully");
        process.exit(0);

    } catch (err) {
        console.error("🔴 Migration failed:", err.message);
        process.exit(1);
    }
};

runMigrations();