import React, { useEffect, useState } from "react";
import { socket } from "./kitchenSocket";

const API = "http://localhost:5000/api";

export default function KitchenDisplayScreen() {
  const [orders, setOrders] = useState([]);

  // โหลดออเดอร์เก่า
  const fetchOrders = async () => {
    const res = await fetch(`${API}/orders/pending`);
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();

    // รับออเดอร์ใหม่แบบ real-time
    socket.on("new_order", (order) => {
      setOrders((prev) => [order, ...prev]);
    });

    // ลบเมื่อ served
    socket.on("order_served", ({ id }) => {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    });

    return () => {
      socket.off("new_order");
      socket.off("order_served");
    };
  }, []);

  // เวลา "รอมาแล้ว"
  const getElapsed = (time) => {
    const diff = Date.now() - new Date(time).getTime();
    return Math.floor(diff / 60000); // นาที
  };

  const markDone = async (id) => {
    await fetch(`${API}/orders/${id}/served`, {
      method: "PUT",
    });

    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Kitchen Display</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-800 p-4 rounded-xl shadow"
          >
            <div className="flex justify-between">
              <h2 className="font-bold">Table {order.table_id}</h2>
              <span className="text-yellow-400">
                {getElapsed(order.created_at)} min
              </span>
            </div>

            <ul className="mt-2 text-sm">
              {order.items.map((item, idx) => (
                <li key={idx}>• {item.name} x{item.qty}</li>
              ))}
            </ul>

            <button
              onClick={() => markDone(order.id)}
              className="mt-3 w-full bg-green-500 hover:bg-green-600 p-2 rounded"
            >
              เสร็จสิ้น
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}