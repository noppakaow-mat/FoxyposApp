const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadMiddleware");

const {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  increaseStock,
  decreaseStock,
  uploadStockExcel,
} = require("../controllers/stockController");


// GET ALL STOCK
router.get("/", getStocks);


// UPLOAD EXCEL
router.post(
    "/upload",
    upload.single("file"),
    uploadStockExcel
);

// GET BY ID
router.get("/:id", getStockById);


// CREATE
router.post("/", createStock);


// UPDATE
router.put("/:id", updateStock);


// DELETE
router.delete("/:id", deleteStock);


// INCREASE
router.put("/:id/increase", increaseStock);


// DECREASE
router.put("/:id/decrease", decreaseStock);


module.exports = router;