const pool = require("../config/db");
const XLSX = require("xlsx");

// ==========================
// GET ALL PRODUCTS
// ==========================
exports.getStocks = async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        c.name AS category,
        p.price,
        p.image_url,

        p.stock_quantity AS quantity,
        p.unit,

        p.minimum_stock,
        p.updated_at,
        p.is_available

      FROM products p

      LEFT JOIN categories c
      ON p.category_id = c.id

      ORDER BY p.id ASC
    `);


    res.status(200).json(result.rows);


  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }
};



// ==========================
// GET PRODUCT BY ID
// ==========================
exports.getStockById = async (req, res) => {

  try {

    const { id } = req.params;


    const result = await pool.query(
      `
      SELECT
        p.*,
        p.stock_quantity AS quantity
      FROM products p
      WHERE p.id=$1
      `,
      [id]
    );


    if (result.rows.length === 0) {

      return res.status(404).json({
        message: "Product not found"
      });

    }


    res.json(result.rows[0]);


  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};




// ==========================
// CREATE PRODUCT
// ==========================
exports.createStock = async (req, res) => {


  try {


    const {

      category_id,
      name,
      price,
      image_url,
      is_complimentary,

      stock_quantity,
      unit,

      is_available

    } = req.body;



    const result = await pool.query(

      `
      INSERT INTO products
      (
        category_id,
        name,
        price,
        image_url,
        is_complimentary,

        stock_quantity,
        unit,

        is_available
      )

      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)

      RETURNING *
      `,

      [

        category_id,
        name,
        price,
        image_url,
        is_complimentary,

        stock_quantity || 0,
        unit || "ชิ้น",

        is_available

      ]

    );



    res.status(201).json(result.rows[0]);



  } catch (err) {


    res.status(500).json({
      message: err.message
    });


  }


};





// ==========================
// UPDATE PRODUCT
// ==========================
exports.updateStock = async (req, res) => {

  try {

    const { id } = req.params;

    const { quantity } = req.body;


    const result = await pool.query(
      `
            UPDATE products
            SET stock_quantity = $1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING *
            `,
      [
        quantity,
        id
      ]
    );


    if (result.rows.length === 0) {

      return res.status(404).json({
        message: "Stock not found"
      });

    }


    res.json(result.rows[0]);


  } catch (error) {

    console.error(
      "Update stock error:",
      error
    );


    res.status(500).json({
      message: error.message
    });

  }

};





// ==========================
// DELETE PRODUCT
// ==========================
exports.deleteStock = async (req, res) => {


  try {


    const { id } = req.params;


    const result = await pool.query(

      `
      DELETE FROM products
      WHERE id=$1
      RETURNING *
      `,

      [id]

    );



    if (result.rows.length === 0) {

      return res.status(404).json({
        message: "Product not found"
      });

    }



    res.json({

      message: "Product deleted successfully"

    });



  } catch (err) {


    res.status(500).json({
      message: err.message
    });


  }


};





// ==========================
// INCREASE STOCK
// ==========================
exports.increaseStock = async (req, res) => {


  try {


    const { id } = req.params;

    const { quantity } = req.body;



    const result = await pool.query(

      `
      UPDATE products

      SET stock_quantity =
      stock_quantity + $1

      WHERE id=$2

      RETURNING *

      `,

      [
        quantity,
        id
      ]

    );


    res.json(result.rows[0]);



  } catch (err) {


    res.status(500).json({
      message: err.message
    });


  }


};





// ==========================
// DECREASE STOCK
// ==========================
exports.decreaseStock = async (req, res) => {


  try {


    const { id } = req.params;

    const { quantity } = req.body;



    const stock = await pool.query(

      `
      SELECT stock_quantity
      FROM products
      WHERE id=$1
      `,

      [id]

    );



    if (stock.rows.length === 0) {

      return res.status(404).json({
        message: "Product not found"
      });

    }



    if (stock.rows[0].stock_quantity < quantity) {


      return res.status(400).json({

        message: "Stock not enough"

      });


    }



    const result = await pool.query(

      `
      UPDATE products

      SET stock_quantity =
      stock_quantity - $1

      WHERE id=$2

      RETURNING *

      `,

      [
        quantity,
        id
      ]

    );



    res.json(result.rows[0]);



  } catch (err) {


    res.status(500).json({
      message: err.message
    });


  }


};
// ==========================
// UPLOAD STOCK EXCEL
// ==========================
exports.uploadStockExcel = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "Excel file required"
            });

        }


        const workbook = XLSX.read(
            req.file.buffer,
            {
                type:"buffer"
            }
        );


        const sheet = workbook.Sheets[workbook.SheetNames[0]];


        const data = XLSX.utils.sheet_to_json(sheet);



        for (const item of data) {


            await pool.query(
                `
                INSERT INTO products
                (
                    name,
                    stock_quantity,
                    unit,
                    minimum_stock
                )

                VALUES
                ($1,$2,$3,$4)

                `,
                [
                    item.name,
                    item.quantity || 0,
                    item.unit || "ชิ้น",
                    item.minimum_stock || 0
                ]
            );


        }



        res.json({
            message:"Upload stock success",
            count:data.length
        });



    } catch(err){

        console.error(
            "Upload excel error:",
            err
        );


        res.status(500).json({
            message:err.message
        });

    }

};