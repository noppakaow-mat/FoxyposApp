import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { getReceipt } from "../cashier/cashierService";

export default function ReceiptScreen() {
  const { sessionId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD RECEIPT FROM API
  // =========================
  useEffect(() => {
    async function loadReceipt() {
      try {
        const data = await getReceipt(sessionId);
        console.log("Receipt:", data);
        setReceipt(data);
      } catch (err) {
        console.error("Load receipt error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (sessionId) {
      loadReceipt();
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">
        กำลังโหลดใบเสร็จ...
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">
        ไม่พบข้อมูลใบเสร็จ
      </div>
    );
  }

  // =========================
  // QR CUSTOMER ORDER URL
  // =========================
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const orderUrl = `${baseUrl}/order/${receipt.session_id}`;
  console.log("CUSTOMER QR:", orderUrl);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4 p-5">

      <div id="receipt" className="bg-white w-80 rounded-2xl shadow-xl p-6 text-black">
        {/* HEADER */}
        <h1
          className="text-center text-2xl font-black"
          style={{ color: "#000000" }}
        >
          FOXY SHABU
        </h1>
        <p className="text-center text-xs text-gray-500">OPEN TABLE RECEIPT</p>

        <hr className="my-4" />

        {/* INFO */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>โต๊ะ</span>
            <b>#{receipt.table_number}</b>
          </div>
          <div className="flex justify-between">
            <span>ลูกค้า</span>
            <b>{receipt.number_of_guests} คน</b>
          </div>
          <div className="flex justify-between">
            <span>Package</span>
            <b>{receipt.package_name}</b>
          </div>
        </div>

        <hr className="my-4" />

        {/* PRICE */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{Number(receipt.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT 7%</span>
            <span>{Number(receipt.vat_amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-600">{Number(receipt.total_amount).toFixed(2)} ฿</span>
          </div>
        </div>

        <hr className="my-4" />

        {/* CUSTOMER QR */}
        <div className="flex flex-col items-center">
          <QRCodeCanvas value={orderUrl} size={180} />
          <p className="mt-3 text-xs text-gray-500 text-center">
            Scan QR เพื่อสั่งอาหาร
          </p>
        </div>
      </div>
       <button
        type="button"
        onClick={handlePrint}
        className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white shadow transition hover:bg-green-700"
      >
        พิมพ์ใบเสร็จ
      </button>
    </div>
  );
}
