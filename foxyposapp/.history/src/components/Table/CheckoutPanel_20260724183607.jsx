import { useState } from "react";
import personIcon from "../../assets/icons/person.svg";

export default function CheckoutPanel({ table, onClose, onFinish }) {
    const [payment, setPayment] = useState("Cash");
    const [qrImage, setQrImage] = useState("");
    const [loadingQR, setLoadingQR] = useState(false);

    if (!table) return null;

    const API_URL = import.meta.env.VITE_API_URL || "http://192.168.1.100:3000/api"

    const createPromptPayQR = async () => {
        try {
            setLoadingQR(true);
            const response = await fetch(`${API_URL}/payments/promptpay`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: Number(table.total_amount || 0)
                })
            });

            const data = await response.json();
            if (data.qr) {
                setQrImage(data.qr);
            }
        } catch (error) {
            console.error("PromptPay QR Error:", error);
        } finally {
            setLoadingQR(false);
        }
    };

    const handlePaymentChange = (e) => {
        const value = e.target.value;
        setPayment(value);

        if (value === "QR Payment") {
            createPromptPayQR();
        } else {
            setQrImage("");
        }
    };

    return (
        <div className="fixed right-0 top-0 h-screen w-96 bg-white p-6 shadow-xl z-50 overflow-auto border-l border-gray-100">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-black transition text-lg">
                    ✕
                </button>
            </div>

            <hr className="my-5" />

            {/* INFO */}
            <p className="text-lg text-gray-700">
                Table : <b className="text-2xl text-gray-950">#{table.table_number}</b>
            </p>

            <div className="flex gap-2 mt-3 items-center text-gray-600">
                <img src={personIcon} className="w-6 h-6" alt="customer icon" />
                <span>
                    Customer : <b className="text-lg text-gray-950">{table.customer_count || 0}</b> คน
                </span>
            </div>

            {/* BILL SUMMARY */}
            <div className="mt-5 bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal:</span>
                    <span>{Number(table.subtotal || 0).toFixed(2)} ฿</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>VAT:</span>
                    <span>{Number(table.vat_amount || 0).toFixed(2)} ฿</span>
                </div>
                <hr className="border-gray-200 my-2" />
                <div className="flex justify-between font-bold text-lg text-green-600">
                    <span>Total:</span>
                    <span>฿{Number(table.total_amount || 0).toFixed(2)}</span>
                </div>
            </div>

            {/* PAYMENT METHOD */}
            <select
                value={payment}
                onChange={handlePaymentChange}
                className="mt-5 w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
            >
                <option value="Cash">Cash</option>
                <option value="QR Payment">QR Payment</option>
                <option value="Credit Card">Credit Card</option>
            </select>

            {/* Omise QR */}
            {payment === "QR Payment" && (
                <div className="mt-5 flex flex-col items-center justify-center bg-gray-50 p-4 rounded-xl border border-gray-150 min-h-[280px]">
                    {loadingQR ? (
                        <p className="text-sm text-gray-500 animate-pulse">กำลังสร้าง QR...</p>
                    ) : qrImage ? (
                        <>
                            <img src={qrImage} alt="PromptPay QR" className="w-56 rounded-lg shadow-sm border border-gray-100" />
                            <p className="mt-3 text-xs text-gray-400">สแกนเพื่อชำระเงิน</p>
                            <p className="mt-1 text-base font-bold text-green-600">
                                ฿{Number(table.total_amount || 0).toFixed(2)}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-gray-400">ไม่สามารถโหลด QR Code ได้</p>
                    )}
                </div>
            )}

            {/* SUBMIT */}
            <button
                onClick={onFinish}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-bold transition shadow-md hover:shadow-lg"
            >
                ชำระเงินเสร็จสิ้น
            </button>
        </div>
    );
}