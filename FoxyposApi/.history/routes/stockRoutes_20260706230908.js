const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnly");
const upload = require("../middleware/uploadMiddleware");

// POST Excel upload
router.post(
  "/upload",
  auth,
  adminOnly,
  upload.single("file"),
  stockController.uploadStockExcel
);

module.exports = router;