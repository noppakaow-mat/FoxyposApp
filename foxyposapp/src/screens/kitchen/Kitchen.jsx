import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../../services/Api";

import KitchenHeader from "../../components/kitchen/KitchenHeader";
import KitchenTableCard from "../../components/kitchen/KitchenTableCard";
import EmptyKitchen from "../../components/kitchen/EmptyKitchen";

import socket from "./kitchenSocket";

const API = API_URL;

export default function KitchenScreen() {
  const [tables, setTables] = useState([]);
  const [openOrders, setOpenOrders] = useState({});
  const [, setTick] = useState(Date.now());

  // =====================================
  // LOAD ORDERS
  // =====================================
  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API}/orders/kitchen`);
      const data = await res.json();

      const formatted = (data || []).map((table) => ({
        ...table,
        orders: (table.orders || []).map((order) => ({
          ...order,
          order_no: order.order_number,
        })),
      }));

      setTables(formatted);
    } catch (err) {
      console.error("LOAD KITCHEN ERROR", err);
    }
  }, []);

  // =====================================
  // SOCKET
  // =====================================
useEffect(() => {
  loadOrders();

  const handleConnect = () => {
    console.log("KITCHEN CONNECT:", socket.id);
  };

  const handleNewOrder = (data) => {
    console.log("NEW ORDER:", data);
    loadOrders();
  };

  const handleOrderServed = (data) => {
    console.log("ORDER SERVED:", data);
    loadOrders();
  };

  socket.on("connect", handleConnect);
  socket.on("newOrder", handleNewOrder);
  socket.on("orderServed", handleOrderServed);

  return () => {
    socket.off("connect", handleConnect);
    socket.off("newOrder", handleNewOrder);
    socket.off("orderServed", handleOrderServed);
  };
}, [loadOrders]);

  // =====================================
  // TIMER
  // =====================================
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // =====================================
  // ACCORDION
  // =====================================
  const toggleOrder = (id) => {
    setOpenOrders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // =====================================
  // SERVE ORDER
  // =====================================
  const serveOrder = async (id) => {
    try {
      const res = await fetch(`${API}/orders/${id}/served`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Serve failed");
      }

      loadOrders();
    } catch (err) {
      console.error("SERVE ERROR", err);
    }
  };

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-zinc-100 sm:px-8">
      <section className="mx-auto max-w-6xl">
        <KitchenHeader count={tables.length} />

        {!tables.length ? (
          <EmptyKitchen />
        ) : (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {tables.map((table) => (
              <KitchenTableCard
                key={
                  table.table_session_id ||
                  table.table_id ||
                  table.table_number
                }
                table={table}
                openOrders={openOrders}
                toggleOrder={toggleOrder}
                serveOrder={serveOrder}
              />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}