import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentScreen() {
  const navigate = useNavigate();

  // ตัวอย่างข้อมูล (ภายหลังเปลี่ยนเป็นดึงจาก API)
  const [payment] = useState({
    table_number: 1,
    package_name: "Buffet Premium",
    customer_count: 4,
    subtotal: 1996,
    vat: 139.72,
    total: 2135.72,
  });

  const [loading, setLoading] = useState(false);

  async function handleCash() {
    setLoading(true);

    // TODO: เรียก API Checkout
    // await checkoutTable(...)

    alert("ชำระเงินสดสำเร็จ");
    navigate("/cashier");
  }

  async function handleOmise() {
    setLoading(true);

    try {
      // TODO: เรียก API สร้าง Omise Checkout
      alert("กำลังเชื่อมต่อ Omise...");
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถเชื่อมต่อ Omise");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-center">
          Payment
        </h1>

        <p className="mt-2 text-center text-gray-500">
          โต๊ะ {payment.table_number}
        </p>

        <div className="mt-8 space-y-3">

          <div className="flex justify-between">
            <span>Package</span>
            <span>{payment.package_name}</span>
          </div>

          <div className="flex justify-between">
            <span>ลูกค้า</span>
            <span>{payment.customer_count} คน</span>
          </div>

          <hr />

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>฿{payment.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>VAT 7%</span>
            <span>฿{payment.vat.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-2xl font-bold">
            <span>Total</span>
            <span>฿{payment.total.toFixed(2)}</span>
          </div>

        </div>

        <div className="mt-8 space-y-3">

          <button
            onClick={handleOmise}
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-white font-bold hover:bg-blue-700"
          >
            ชำระผ่าน Omise
          </button>

          <button
            onClick={handleCash}
            disabled={loading}
            className="w-full rounded-xl bg-green-600 py-3 text-white font-bold hover:bg-green-700"
          >
            เงินสด
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full rounded-xl bg-gray-300 py-3 font-bold"
          >
            ย้อนกลับ
          </button>

        </div>

      </div>
    </div>
  );
}