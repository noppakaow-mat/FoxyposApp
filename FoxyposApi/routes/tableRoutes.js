const express = require("express");

const router = express.Router();

const tableController = require("../controllers/tableController");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");


// GET TABLES
router.get(
    "/",
    auth,
    role("cashier"),
    tableController.getTables
);

// OPEN TABLE
router.post(
    "/open",
    auth,
    role("cashier"),
    tableController.openTable
);

router.post(
  "/checkout",
  auth,
  role("cashier"),
  tableController.checkoutTable
);  
                
router.get(
  "/qr/:sessionId",
  auth,
  role("cashier"),
  tableController.getSessionQr
);

router.get(
  "/receipt/:sessionId",
  tableController.getReceipt
);
router.get(
  "/:sessionId",
  tableController.getSessionInfo
);
module.exports = router;
