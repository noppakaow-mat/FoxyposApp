const express = require("express");
const router = express.Router();

const {
    createPromptPayQR
} = require("../controllers/paymentController");


router.post(
    "/promptpay",
    createPromptPayQR
);


module.exports = router;