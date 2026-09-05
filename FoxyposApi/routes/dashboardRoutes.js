const express = require("express");
const router = express.Router();

const {
    getSummary,
    getTopProducts,
    getMonthlySales
} = require("../controllers/dashboardController");

router.get("/summary", getSummary);

router.get("/top-products", getTopProducts);

router.get("/monthly-sales", getMonthlySales);

module.exports = router;