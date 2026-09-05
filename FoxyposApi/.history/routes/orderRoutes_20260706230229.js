const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController");

// mock DB
let orders = [];

router.post("/orders", createOrder);

router.get("/orders/pending", (req, res) => {
  const pending = orders.filter(o => o.status === "pending");
  res.json(pending);
});

router.put("/orders/:id/served", (req, res) => {
  const { id } = req.params;

  orders = orders.map(o =>
    o.id == id ? { ...o, status: "served" } : o
  );

  const io = req.app.get("io");
  io.emit("order_served", { id });

  res.json({ message: "updated" });
});

module.exports = router;