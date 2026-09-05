// src/screens/customer/MenuCatalogScreen.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  createCart,
  addItem,
  decreaseItem,
  clearCart,
  getTotalQty,
  getTotalPrice,
} from "../../utils/cartHelper";

import {
  fetchMenuBySession,
  createOrder,
} from "../../services/customerApi";

export default function MenuCatalogScreen() {
  const { sessionId } = useParams();

  const [menu, setMenu] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [cart, setCart] = useState(createCart());
  const [loading, setLoading] = useState(true);

  // โหลดเมนู
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMenuBySession(sessionId);
        setMenu(data);

        if (data.length > 0) {
          setActiveCategory(data[0].category);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [sessionId]);

  const currentItems =
    menu.find((m) => m.category === activeCategory)?.items || [];

  const handleAdd = (item) => {
    setCart((prev) => addItem({ ...prev }, item));
  };

  const handleMinus = (id) => {
    setCart((prev) => decreaseItem({ ...prev }, id));
  };

  const handleClear = () => {
    setCart(clearCart());
  };

  const handleOrder = async () => {
    try {
      await createOrder(sessionId, cart);
      alert("สั่งอาหารเรียบร้อยแล้ว");
      setCart(clearCart());
    } catch (err) {
      alert("ส่งออเดอร์ไม่สำเร็จ");
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Category */}
      <div className="flex gap-2 p-3 overflow-x-auto border-b">
        {menu.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeCategory === cat.category
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="p-3 space-y-3">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border p-3 rounded-xl"
          >
            <div>
              <div className="font-semibold">{item.name}</div>
              <div className="text-gray-500">{item.price} THB</div>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => handleMinus(item.id)}
                className="px-3 bg-gray-200 rounded"
              >
                -
              </button>

              <button
                onClick={() => handleAdd(item)}
                className="px-3 bg-black text-white rounded"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 flex justify-between">
        <div>
          🛒 {getTotalQty(cart)} รายการ | {getTotalPrice(cart)} บาท
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="px-3 bg-gray-700 rounded"
          >
            ล้าง
          </button>

          <button
            onClick={handleOrder}
            className="px-4 bg-green-500 rounded"
          >
            สั่งอาหาร
          </button>
        </div>
      </div>
    </div>
  );
}