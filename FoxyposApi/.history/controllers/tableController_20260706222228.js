const pool = require("../db");

// ==============================
// GET All Tables
// ==============================
exports.getTables = async (req, res) => {

    try {

        const tables = await pool.query(`
            SELECT
                id,
                table_name,
                status
            FROM restaurant_tables
            ORDER BY id ASC
        `);

        res.json(tables.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


// ==============================
// Open Table
// ==============================
exports.openTable = async (req, res) => {

    const client = await pool.connect();

    try {

        const {
            table_id,
            customer_count,
            package_id
        } = req.body;

        if (!table_id || !customer_count || !package_id) {

            return res.status(400).json({
                message: "Missing required fields"
            });

        }

        await client.query("BEGIN");

        // --------------------------
        // ตรวจสอบโต๊ะ
        // --------------------------

        const tableResult = await client.query(
            `
            SELECT *
            FROM restaurant_tables
            WHERE id = $1
            FOR UPDATE
            `,
            [table_id]
        );

        if (tableResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Table not found"
            });

        }

        if (tableResult.rows[0].status === "occupied") {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Table already occupied"
            });

        }

        // --------------------------
        // ดึงข้อมูล Package
        // --------------------------

        const packageResult = await client.query(
            `
            SELECT *
            FROM buffet_packages
            WHERE id=$1
            `,
            [package_id]
        );

        if (packageResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Package not found"
            });

        }

        const packageData = packageResult.rows[0];

        // ==========================
        // Calculate
        // ==========================

        const buffetTotal =
            Number(customer_count) * Number(packageData.price);

        const vat =
            buffetTotal * 0.07;

        const grandTotal =
            buffetTotal + vat;

        // ==========================
        // Create Session
        // ==========================

        const sessionResult = await client.query(
            `
            INSERT INTO table_sessions
            (
                table_id,
                package_id,
                customer_count,
                buffet_total,
                vat,
                grand_total,
                status
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,'active')
            RETURNING *
            `,
            [
                table_id,
                package_id,
                customer_count,
                buffetTotal,
                vat,
                grandTotal
            ]
        );

        // ==========================
        // Update Table Status
        // ==========================

        await client.query(
            `
            UPDATE restaurant_tables
            SET status='occupied'
            WHERE id=$1
            `,
            [table_id]
        );

        await client.query("COMMIT");

        const session = sessionResult.rows[0];

        res.status(201).json({

            message: "Table Opened",

            session,

            calculation: {

                customer_count,

                package_price: packageData.price,

                buffet_total: buffetTotal,

                vat,

                grand_total: grandTotal

            },

            order_url: `http://localhost:5173/order/${session.id}`

        });

    } catch (err) {

        await client.query("ROLLBACK");

        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });

    } finally {

        client.release();

    }

};