import { useState } from "react";
import {
    Plus,
    Minus,
    Trash2,
    Pencil,
    Save,
    Search,
} from "lucide-react";
import StockStatusBadge from "./StockStatusBadge";

export default function StockTable({
    stocks = [],
    onIncrease,
    onDecrease,
    onChangeStock,
    onUpdate,
    onDelete,
}) {
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");

    const filteredStocks = stocks.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = async (item) => {
        if (editingId === item.id) {
            await onUpdate?.(item.id, item.quantity);
            setEditingId(null);
        } else {
            setEditingId(item.id);
        }
    };

    return (
        <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        Stock Management
                    </h2>

                    <p className="text-sm text-gray-500">
                        รายการสินค้าและจำนวนคงเหลือ
                    </p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        placeholder="ค้นหาสินค้า..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-gray-500">
                            <th className="py-3 text-left">#</th>
                            <th className="py-3 text-left">สินค้า</th>
                            <th className="py-3 text-center">จำนวน</th>
                            <th className="py-3 text-center">หน่วย</th>
                            <th className="py-3 text-center">สถานะ</th>
                            <th className="py-3 text-right">
                                อัปเดตล่าสุด
                            </th>
                            <th className="py-3 text-center">
                                จัดการ
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredStocks.length > 0 ? (
                            filteredStocks.map((item, index) => {
                                const isEditing = editingId === item.id;

                                return (
                                    <tr
                                        key={item.id}
                                        className="border-b last:border-none hover:bg-gray-50"
                                    >
                                        <td className="py-4 font-semibold text-gray-700">
                                            {index + 1}
                                        </td>

                                        <td className="py-4 font-medium text-gray-800">
                                            {item.name}
                                        </td>

                                        <td className="py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    disabled={!isEditing}
                                                    onClick={() =>
                                                        onDecrease?.(
                                                            item.id,
                                                            1
                                                        )
                                                    }
                                                    className={`w-8 h-8 rounded-lg border flex items-center justify-center ${isEditing
                                                            ? "border-gray-300 hover:bg-gray-100 text-gray-700"
                                                            : "border-gray-200 text-gray-300 cursor-not-allowed"
                                                        }`}
                                                >
                                                    <Minus size={15} />
                                                </button>

                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    disabled={!isEditing}
                                                    onChange={(e) =>
                                                        onChangeStock?.(
                                                            item.id,
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    className={`w-16 text-center font-semibold px-2 py-1 rounded-lg border outline-none ${isEditing
                                                            ? "border-blue-500"
                                                            : "bg-gray-100 text-gray-500 cursor-not-allowed"
                                                        }`}
                                                />

                                                <button
                                                    disabled={!isEditing}
                                                    onClick={() =>
                                                        onIncrease?.(
                                                            item.id,
                                                            1
                                                        )
                                                    }
                                                    className={`w-8 h-8 rounded-lg border flex items-center justify-center ${isEditing
                                                            ? "border-gray-300 hover:bg-gray-100 text-gray-700"
                                                            : "border-gray-200 text-gray-300 cursor-not-allowed"
                                                        }`}
                                                >
                                                    <Plus size={15} />
                                                </button>
                                            </div>
                                        </td>

                                        <td className="py-4 text-center text-gray-600">
                                            {item.unit || "ชิ้น"}
                                        </td>

                                        <td className="py-4 text-center">
                                            <StockStatusBadge
                                                stock_quantity={item.quantity}
                                                minimum_stock={item.minimum_stock}
                                            />
                                        </td>

                                        <td className="py-4 text-right text-gray-500">
                                            {item.updated_at
                                                ? new Date(
                                                    item.updated_at
                                                ).toLocaleString("th-TH")
                                                : "-"}
                                        </td>

                                        <td className="py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(item)
                                                    }
                                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${isEditing
                                                            ? "bg-green-500 text-white hover:bg-green-600"
                                                            : "bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white"
                                                        }`}
                                                >
                                                    {isEditing ? (
                                                        <Save size={16} />
                                                    ) : (
                                                        <Pencil size={16} />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        if (
                                                            window.confirm(
                                                                "ต้องการลบสินค้านี้ใช่ไหม?"
                                                            )
                                                        ) {
                                                            onDelete?.(item.id);
                                                        }
                                                    }}
                                                    className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="py-8 text-center text-gray-400"
                                >
                                    ไม่พบสินค้าที่ค้นหา
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}