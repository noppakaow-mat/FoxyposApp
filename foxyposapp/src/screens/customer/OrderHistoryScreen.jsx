import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderHistory } from "../../services/customerApi";
import socket from "../kitchen/kitchenSocket";

export default function OrderHistoryScreen() {
    const navigate = useNavigate();
    const { sessionId } = useParams();

    const [orders, setOrders] = useState([]);


    useEffect(() => {
        loadOrders();
        socket.on("new_order", () => {
            console.log("NEW ORDER HISTORY UPDATE");
            loadOrders();
        });
        socket.on("order_served", () => {
            loadOrders();
        });
        return () => {
            socket.off("new_order");
            socket.off("order_served");
        };


    }, [sessionId]);

    async function loadOrders() {
        try {
            const data = await getOrderHistory(sessionId);
            setOrders(
                data.orders || data || []
            );
        } catch (err) {
            console.error("LOAD ORDER HISTORY ERROR:", err);
        }
    }

    return (
        <main className="min-h-screen bg-black text-zinc-100 p-5">
            <header className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="rounded-xl bg-zinc-900 px-4 py-2"
                >
                    ←
                </button>
                <h1 className="text-xl font-black">
                    รายการที่สั่ง
                </h1>
            </header>
            <div className="space-y-3">
                {orders.length === 0 ? (
                    <p className="text-zinc-400">
                        ยังไม่มีรายการที่สั่ง
                    </p>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-2xl bg-zinc-900 p-4"
                        >
                            <div className="flex justify-between mb-3">
                                <p className="text-yellow-400 font-black">
                                    ORDER #{order.order_number}
                                </p>
                                <p className="text-xs text-green-400">
                                    {order.status}
                                </p>
                            </div>
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between mt-2"
                                >
                                    <span>
                                        {item.name}
                                    </span>
                                    <span className="text-yellow-400 font-bold">
                                        x{item.qty}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </main>
    );
}