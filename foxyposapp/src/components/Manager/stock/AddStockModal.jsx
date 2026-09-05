import { useState } from "react";
import { X, PackagePlus } from "lucide-react";

export default function AddStockModal({
    open,
    onClose,
    onSave,
}) {

    const [form, setForm] = useState({
        name: "",
        quantity: "",
        unit: "ชิ้น",
    });


    if (!open) return null;

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));

    };


    const handleSubmit = () => {

        onSave({
            ...form,
            stock_quantity: Number(form.quantity || 0)
        });


        setForm({
            name: "",
            quantity: "",
            unit: "ชิ้น",
        });

    };


    return (

        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">


            <div className="bg-white w-[420px] rounded-3xl shadow-xl p-6">


                <div className="flex items-center justify-between mb-6">


                    <div className="flex items-center gap-3">


                        <div className="w-11 h-11 rounded-xl bg-yellow-100 flex items-center justify-center">

                            <PackagePlus size={24} className="text-yellow-500" />

                        </div>


                        <div>

                            <h2 className="text-lg font-bold text-gray-800">
                                เพิ่มสินค้า Stock
                            </h2>

                            <p className="text-sm text-gray-500">
                                เพิ่มรายการสินค้าใหม่เข้าสู่ระบบ
                            </p>

                        </div>


                    </div>



                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                    >

                        <X size={18} />

                    </button>


                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700">
                            ชื่อสินค้า
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="เช่น กุ้งสด"
                            className="mt-1 w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400"
                        />
                    </div>




                    <div>

                        <label className="text-sm font-semibold text-gray-700">
                            จำนวนเริ่มต้น
                        </label>
                        <input
                            name="quantity"
                            type="number"
                            min="0"
                            value={form.quantity}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400"
                        />
                    </div>




                    <div>

                        <label className="text-sm font-semibold text-gray-700">
                            หน่วย
                        </label>


                        <select
                            name="unit"
                            value={form.unit}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 bg-white"
                        >

                            <option>กิโลกรัม</option>
                            <option>กรัม</option>
                            <option>ลิตร</option>
                            <option>ขวด</option>
                            <option>แพ็ค</option>
                            <option>ถุง</option>
                            <option>กล่อง</option>
                            <option>ลัง</option>
                            <option>ชิ้น</option>


                        </select>


                    </div>



                </div>





                <div className="flex justify-end gap-3 mt-7">


                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border text-gray-600 hover:bg-gray-100"
                    >
                        ยกเลิก
                    </button>



                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow-sm"
                    >
                        เพิ่มสินค้า
                    </button>


                </div>



            </div>


        </div>

    );

}