const xlsx = require("xlsx");
const pool = require("../config/db");

// POST /api/stock/upload
exports.uploadStockExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // อ่านไฟล์ Excel
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);

    /**
     * ตัวอย่าง Excel format:
     * | product_id | stock |
     */

    for (const row of data) {
      const { product_id, stock } = row;

      if (!product_id || stock === undefined) continue;

      await pool.query(
        `UPDATE products
         SET stock = $1
         WHERE id = $2`,
        [stock, product_id]
      );
    }

    res.json({
      message: "Stock updated successfully",
      updated: data.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};