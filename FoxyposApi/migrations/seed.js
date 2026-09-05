const fs = require("fs");
const path = require("path");
const pool = require("../Config/db");

async function seed() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, "seed.sql"),
      "utf8"
    );

    await pool.query(sql);

    console.log("Seed completed");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

seed();
