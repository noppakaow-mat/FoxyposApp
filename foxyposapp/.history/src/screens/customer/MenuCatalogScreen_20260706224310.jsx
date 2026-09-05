import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getMenus,
    getCategories,
    createOrder
} from "../../services/customerApi";

export default function MenuCatalogScreen() {

    const { sessionId } = useParams();

    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    const [cart, setCart] = useState([]);

    // =========================
    // LOAD DATA
    // =========================
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [menuRes, catRes] = await Promise.all([
                getMenus(),
                getCategories()
            ]);

            setMenus(menuRes.data);
            setCategories(catRes.data);

            if (catRes.data.length > 0) {
                setActiveCategory(catRes.data[0].category_id);
            }

        } catch (err) {
            console.log(err);
        }
    };

    // =========================
    // CART LOGIC
    // =========================
    const addToCart = (menu) => {
        setCart((prev) => {
            const exist = prev.find(item => item.menu_id === menu.menu_id);

            if (exist) {
                return prev.map(item =>
                    item.menu_id === menu.menu_id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }

            return [...prev, { ...menu, qty: 1 }];
        });
    };

    const decreaseQty = (menuId) => {
        setCart((prev) =>
            prev
                .map(item =>
                    item.menu_id === menuId
                        ? { ...item, qty: item.qty - 1 }
                        : item
                )
                .filter(item => item.qty > 0)
        );
    };

    // =========================
    // ORDER SUBMIT
    // =========================
    const handleSubmitOrder = async () => {
        try {
            await createOrder({
                session_id: sessionId,
                items: cart.map(item => ({
                    menu_id: item.menu_id,
                    quantity: item.qty
                }))
            });

            alert("สั่งอาหารสำเร็จแล้ว!");

            setCart([]);

        } catch (err) {
            alert("เกิดข้อผิดพลาดในการสั่งอาหาร");
        }
    };

    // =========================
    // FILTER MENU
    // =========================
    const filteredMenus = menus.filter(
        m => m.category_id === activeCategory
    );

    const cartTotal = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">

            {/* HEADER */}
            <div className="bg-white p-4 shadow text-center font-bold">
                🍽 Menu Order
            </div>

            {/* CATEGORY SCROLL */}
            <div className="flex gap-3 overflow-x-auto p-3 bg-white">
                {categories.map(cat => (
                    <button
                        key={cat.category_id}
                        onClick={() => setActiveCategory(cat.category_id)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap ${
                            activeCategory === cat.category_id
                                ? "bg-black text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        {cat.category_name}
                    </button>
                ))}
            </div>

            {/* MENU LIST */}
            <div className="grid grid-cols-2 gap-3 p-3 flex-1 overflow-auto">
                {filteredMenus.map(menu => (
                    <div
                        key={menu.menu_id}
                        className="bg-white p-3 rounded-xl shadow"
                    >
                        <div className="font-bold">{menu.menu_name}</div>
                        <div className="text-sm text-gray-500">
                            {menu.price} บาท
                        </div>

                        <button
                            onClick={() => addToCart(menu)}
                            className="mt-2 w-full bg-green-500 text-white rounded p-2"
                        >
                            + เพิ่ม
                        </button>
                    </div>
                ))}
            </div>

            {/* CART BAR */}
            <div className="bg-white border-t p-3">

                <div className="max-h-32 overflow-auto text-sm">
                    {cart.map(item => (
                        <div
                            key={item.menu_id}
                            className="flex justify-between py-1"
                        >
                            <span>
                                {item.menu_name} x {item.qty}
                            </span>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => decreaseQty(item.menu_id)}
                                    className="px-2 bg-red-500 text-white rounded"
                                >
                                    -
                                </button>

                                <button
                                    onClick={() => addToCart(item)}
                                    className="px-2 bg-green-500 text-white rounded"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TOTAL + ORDER BUTTON */}
                <div className="flex justify-between items-center mt-3">
                    <div className="font-bold">
                        รวม: {cartTotal} บาท
                    </div>

                    <button
                        onClick={handleSubmitOrder}
                        disabled={cart.length === 0}
                        className="bg-black text-white px-5 py-2 rounded disabled:opacity-50"
                    >
                        ส่งออเดอร์
                    </button>
                </div>

            </div>

        </div>
    );
}