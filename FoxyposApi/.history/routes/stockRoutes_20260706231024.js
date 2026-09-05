const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");
const auth = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// POST Excel upload
router.post(
  "/upload",
  auth,
  adminOnly,
  upload.single("file"),
  stockController.uploadStockExcel
);

module.exports = router;