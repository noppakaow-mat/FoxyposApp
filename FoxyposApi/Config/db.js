const { Pool } = require("pg");
require("dotenv").config();

const poolConfig = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    };

// Render PostgreSQL requires an encrypted connection. Keep SSL opt-in for
// local PostgreSQL, which commonly runs without TLS.
if (
    process.env.DB_SSL === "true" ||
    process.env.NODE_ENV === "production" ||
    process.env.RENDER === "true" ||
    process.env.DATABASE_URL
) {
    poolConfig.ssl = { rejectUnauthorized: false };
}

// Use Thailand time for CURRENT_DATE/CURRENT_TIMESTAMP and legacy TIMESTAMP
// columns in the existing schema.
poolConfig.options = "-c timezone=Asia/Bangkok";

const pool = new Pool(poolConfig);

pool.on("connect", (client) => {
    client.query("SET TIME ZONE 'Asia/Bangkok'").catch((error) => {
        console.error("Failed to set database timezone:", error);
    });
    console.log("PostgreSQL connected");
});
module.exports = pool;
