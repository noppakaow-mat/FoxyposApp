const createOrder = async (req, res) => {
  try {
    const io = req.app.get("io");

    const { items, table_id } = req.body;

    // mock insert db (แทนด้วย PostgreSQL จริง)
    const newOrder = {
      id: Date.now(),
      table_id,
      items,
      status: "pending",
      created_at: new Date(),
    };

    // 🔥 ส่งไปครัวทันที
    io.emit("new_order", newOrder);

    res.status(201).json({
      message: "Order created",
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder };