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

const pool = new Pool(poolConfig);

pool.on("connect", () => {
    console.log("PostgreSQL connected");
});
module.exports = pool;
