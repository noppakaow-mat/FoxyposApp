const express = require("express");
const router = express.Router();

const {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  increaseStock,
  decreaseStock,
} = require("../controllers/stockController");

// ==========================
// GET ALL PRODUCTS
// ==========================
router.get("/", getStocks);

// ==========================
// GET PRODUCT BY ID
// ==========================
router.get("/:id", getStockById);

// ==========================
// CREATE PRODUCT
// ==========================
router.post("/", createStock);

// ==========================
// UPDATE PRODUCT
// ==========================
router.put("/:id", updateStock);

// ==========================
// DELETE PRODUCT
// ==========================
router.delete("/:id", deleteStock);

// ==========================
// INCREASE STOCK
// ==========================
router.patch("/:id/increase", increaseStock);

// ==========================
// DECREASE STOCK
// ==========================
router.patch("/:id/decrease", decreaseStock);

module.exports = router;