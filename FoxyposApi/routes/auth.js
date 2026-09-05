const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");


// =====================
// LOGIN
// =====================
router.post(
    "/login",
    authController.login
);

// =====================
// CASHIER
// =====================
router.get(
    "/cashier",
    auth,
    role("cashier"),
    (req, res) => {
        res.json({
            message: "Cashier Page"
        });
    }
);


// =====================
// KITCHEN
// =====================
router.get(
    "/kitchen",
    auth,
    role("kitchen"),
    (req, res) => {
        res.json({
            message: "Kitchen Page"
        });
    }
);

module.exports = router;
