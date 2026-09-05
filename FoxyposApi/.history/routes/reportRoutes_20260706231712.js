const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");
const auth = require("../middlewares/authMiddleware");
const adminOnly = require("../middlewares/roleMiddleware");

// KPI
router.get("/kpi", auth, adminOnly, reportController.getKPI);

// Daily sales
router.get("/daily", auth, adminOnly, reportController.getDailySales);

// Monthly sales
router.get("/monthly", auth, adminOnly, reportController.getMonthlySales);

// Top products
router.get("/top-products", auth, adminOnly, reportController.getTopProducts);

module.exports = router;