const express = require("express");
const router = express.Router();

const {
  createOrder,
  getPendingOrders,
  markOrderServed,
  getOrdersBySession
} = require("../controllers/orderController");


// CREATE ORDER
router.post(
  "/orders",
  createOrder
);


// KITCHEN ORDERS
router.get(
  "/orders/kitchen",
  getPendingOrders
);


// SERVED
router.put(
  "/orders/:id/served",
  markOrderServed
);


// CUSTOMER HISTORY
router.get(
  "/orders/session/:sessionId",
  getOrdersBySession
);


module.exports = router;