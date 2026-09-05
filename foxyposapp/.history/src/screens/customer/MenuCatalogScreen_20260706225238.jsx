// src/screens/customer/MenuCatalogScreen.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  addItem,
  decreaseItem,
  clearCart,
  getTotalItems,
  getTotalPrice,
} from "../../utils/cartHelper";

import {
  getMenuByCategory,
  createOrder,
} from "../../services/productService";

export default function MenuCatalogScreen() {
  const { sessionId } = useParams();

  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);

  // โหลดเมนู
  useEffect(() => {
    const loadMenu = async () => {
      const data = await getMenuByCategory(sessionId);
      setMenu(data);
    };

    loadMenu();
  }, [sessionId]);

  // filter หมวดหมู่
  const categories = ["all", ...new Set(menu.map(item => item.category))];

  const filteredMenu =
    category === "all"
      ? menu
      : menu.filter(item => item.category === category);

  // เพิ่มลงตะกร้า
  const handleAdd = (item) => {
    setCart(prev => addItem(prev, item));
  };

  const handleDecrease = (id) => {
    setCart(prev => decreaseItem(prev, id));
  };

  // ส่งออเดอร์
  const handleSubmitOrder = async () => {
    const payload = {
      sessionId,
      items: cart,
      totalPrice: getTotalPrice(cart),
    };

    const res = await createOrder(payload);

    if (res?.success) {
      alert("สั่งอาหารสำเร็จแล้ว 🍽️");
      setCart(clearCart());
    } else {
      alert("ส่งออเดอร์ไม่สำเร็จ");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-32">

      {/* Header */}
      <h1 className="text-xl font-bold mb-3">
        Menu Catalog
      </h1>

      {/* Category */}
      <div className="flex gap-2 overflow-x-auto mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap ${
              category === cat ? "bg-yellow-400 text-black" : "bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu List */}
      <div className="grid grid-cols-2 gap-3">
        {filteredMenu.map(item => (
          <div key={item.id} className="bg-gray-800 p-3 rounded-xl">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-400">
              {item.price} ฿
            </p>

            <div className="flex justify-between mt-2">
              <button
                onClick={() => handleDecrease(item.id)}
                className="px-2 bg-red-500 rounded"
              >
                -
              </button>

              <button
                onClick={() => handleAdd(item)}
                className="px-2 bg-green-500 rounded"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 flex justify-between items-center">
        <div>
          🛒 {getTotalItems(cart)} items | {getTotalPrice(cart)} ฿
        </div>

        <button
          onClick={handleSubmitOrder}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold"
        >
          ส่งออเดอร์
        </button>
      </div>
    </div>
  );
}