import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  addItem,
  decreaseItem,
  getTotalItems,
  getTotalPrice,
} from "../../utils/cartHelper";

import {
  scanCustomerMenu,
  createCustomerOrder,
  getCustomerOrders,
} from "../../services/customerApi";

import cartIcon from "../../assets/icons/cart.svg";
import menuIcon from "../../assets/icons/menu.svg";

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

export default function MenuCatalogScreen() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [tableNumber, setTableNumber] = useState(null);
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load Initial Data
  useEffect(() => {
    async function loadData() {
      try {
        setIsMenuLoading(true);
        setError("");

        const menuResult = await scanCustomerMenu(sessionId);
        setMenu(Array.isArray(menuResult.menus) ? menuResult.menus : []);
        setTableNumber(menuResult.table_number);

        const orderResult = await getCustomerOrders(sessionId);
        setOrderHistory(orderResult.orders || []);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setIsMenuLoading(false);
      }
    }

    if (sessionId) {
      loadData();
    }
  }, [sessionId]);

  // Extract Categories
  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(menu.map((item) => item.category_name).filter(Boolean)),
    ];
  }, [menu]);

  // Filter Menu Items
  const filteredMenu = useMemo(() => {
    return category === "all"
      ? menu
      : menu.filter((item) => item.category_name === category);
  }, [menu, category]);

  const getItemQuantity = (id) =>
    cart.find((item) => item.id === id)?.qty || 0;

  // Handle Submit Order
  const handleSubmitOrder = async () => {
    if (!cart.length) return;

    try {
      setIsSubmitting(true);

      const result = await createCustomerOrder({
        sessionId,
        items: cart,
        totalPrice: getTotalPrice(cart),
      });

      if (result?.success || result?.message) {
        alert("ส่งออเดอร์เข้าครัวแล้ว 🍽️");
        setCart([]);

        // ดึงข้อมูลใหม่เพื่ออัปเดตประวัติออเดอร์
        const orderResult = await getCustomerOrders(sessionId);
        setOrderHistory(orderResult.orders || []);
      } else {
        alert("ส่งออเดอร์ไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartItemCount = getTotalItems(cart);

  return (
    <main className="min-h-screen bg-black pb-36 text-zinc-100">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-yellow-500/30 bg-black/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto max-w-3xl flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-zinc-400">
              FOXY SHABU
            </p>
            <div className="mt-1 text-sm text-yellow-400">
              โต๊ะ
              <span className="ml-1 font-bold text-white">
                {tableNumber ? tableNumber : "..."}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/orders/${sessionId}`)}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-yellow-400 ring-1 ring-zinc-800 hover:bg-zinc-800 transition-colors"
          >
            <img src={menuIcon} alt="Menu" className="h-5 w-5 invert" />
            <span>รายการที่สั่ง</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-3xl px-4 py-5">
        {/* CATEGORY BAR */}
        <nav className="mb-5 flex gap-2 overflow-x-auto scrollbar-none py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-all ${
                category === cat
                  ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                  : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </nav>

        {/* LOADING & ERROR STATES */}
        {isMenuLoading && (
          <p className="py-10 text-center text-sm text-zinc-400 animate-pulse">
            กำลังโหลดเมนู...
          </p>
        )}

        {error && (
          <p className="py-10 text-center text-sm text-red-500">{error}</p>
        )}

        {/* MENU GRID */}
        {!isMenuLoading && !error && (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filteredMenu.map((item) => {
              const qty = getItemQuantity(item.id);

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl bg-zinc-900 flex flex-col justify-between border border-zinc-800/50"
                >
                  <div>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-32 w-full bg-zinc-800 object-cover"
                    />

                    <div className="p-3">
                      <p className="font-bold line-clamp-2 min-h-[2.5rem] text-sm sm:text-base break-words">
                        {item.name}
                      </p>
                      <p className="mt-1 font-black text-yellow-500">
                        ฿{formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* QUANTITY CONTROL */}
                  <div className="p-3 pt-0">
                    <div className="flex items-center justify-between rounded-xl bg-zinc-800 p-1 ring-1 ring-zinc-700/50">
                      <button
                        onClick={() =>
                          setCart((c) => decreaseItem(c, item.id))
                        }
                        className="px-3 py-1 rounded-lg font-bold text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                      >
                        -
                      </button>

                      <span className="font-bold text-sm text-white">
                        {qty}
                      </span>

                      <button
                        onClick={() => setCart((c) => addItem(c, item))}
                        className="px-3 py-1 rounded-lg font-bold text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {/* CART FOOTER */}
      <footer className="fixed bottom-0 inset-x-0 border-t border-zinc-800 bg-black/95 p-4 backdrop-blur-md z-20">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src={cartIcon} alt="Cart" className="w-8 invert shrink-0" />
            <div>
              <p className="text-xs text-zinc-400">{cartItemCount} รายการ</p>
              <p className="text-lg font-black text-yellow-400">
                ฿{formatPrice(getTotalPrice(cart))}
              </p>
            </div>
          </div>

          <button
            disabled={!cartItemCount || isSubmitting}
            onClick={handleSubmitOrder}
            className="rounded-2xl bg-yellow-500 px-6 py-3 font-black text-black transition-all hover:bg-yellow-400 active:scale-95 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:scale-100 whitespace-nowrap shadow-lg shadow-yellow-500/10"
          >
            {isSubmitting ? "กำลังส่ง..." : "ยืนยันออเดอร์"}
          </button>
        </div>
      </footer>
    </main>
  );
}