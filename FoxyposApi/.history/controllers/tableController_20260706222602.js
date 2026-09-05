const pool = require("../config/db");

// =====================================
// GET ALL TABLES
// =====================================

exports.getTables = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                table_name,
                status
            FROM restaurant_tables
            ORDER BY id ASC
        `);

        res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// =====================================
// OPEN TABLE
// =====================================

exports.openTable = async (req, res) => {

    const client = await pool.connect();

    try {

        const {

            table_id,
            customer_count,
            package_id,
            cashier_id

        } = req.body;

        // ===========================
        // Validate
        // ===========================

        if (!table_id || !customer_count || !package_id || !cashier_id) {

            return res.status(400).json({
                message: "Missing required fields"
            });

        }

        await client.query("BEGIN");

        // ===========================
        // Check Table
        // ===========================

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

        const table = tableResult.rows[0];

        if (table.status === "occupied") {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Table is already occupied"
            });

        }

        // ===========================
        // Get Package
        // ===========================

        const packageResult = await client.query(
            `
            SELECT *
            FROM buffet_packages
            WHERE id = $1
            `,
            [package_id]
        );

        if (packageResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Package not found"
            });

        }

        const buffetPackage = packageResult.rows[0];

        // ===========================
        // Calculate
        // ===========================

        const buffetTotal =
            Number(customer_count) *
            Number(buffetPackage.price);

        const vat =
            Number((buffetTotal * 0.07).toFixed(2));

        const grandTotal =
            Number((buffetTotal + vat).toFixed(2));

        // ===========================
        // Create Session
        // ===========================

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
                cashier_id,
                payment_status,
                start_time,
                status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                'unpaid',
                NOW(),
                'active'
            )
            RETURNING *
            `,
            [
                table_id,
                package_id,
                customer_count,
                buffetTotal,
                vat,
                grandTotal,
                cashier_id
            ]
        );

        // ===========================
        // Update Table Status
        // ===========================

        await client.query(
            `
            UPDATE restaurant_tables
            SET status = 'occupied'
            WHERE id = $1
            `,
            [table_id]
        );

        await client.query("COMMIT");

        const session = sessionResult.rows[0];

        res.status(201).json({

            message: "Open table successfully",

            session,

            calculation: {

                customer_count,

                package_name: buffetPackage.package_name,

                package_price: buffetPackage.price,

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