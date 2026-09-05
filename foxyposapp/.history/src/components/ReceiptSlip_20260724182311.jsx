import { QRCodeCanvas } from "qrcode.react";

export default function ReceiptSlip({ data }) {
  if (!data || !data.session || !data.calculation) return null;

  const sessionId = data.session.id;
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const orderUrl = `${baseUrl}/order/${sessionId}`;

  return (
    <div className="bg-white p-4 text-black border border-gray-200 shadow-sm rounded-lg" style={{ width: "300px" }}>
      {/* HEADER */}
      <h2 className="text-center font-black text-xl tracking-wide invert">FOXY SHABU</h2>
      <p className="text-center text-xs text-gray-400 uppercase tracking-wider mt-0.5">Welcome Receipt</p>
      
      <hr className="my-3 border-dashed border-gray-300" />

      {/* DETAILED INFO */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Table:</span>
          <span className="font-bold">#{data.session.table_id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Customer:</span>
          <span className="font-medium">{data.session.number_of_guests} คน</span>
        </div>
        <div className="flex justify-between items-start">
          <span className="text-gray-500">Package:</span>
          <span className="font-medium text-right max-w-[180px] break-words">{data.calculation.package}</span>
        </div>
      </div>

      <hr className="my-3 border-dashed border-gray-300" />

      {/* TOTAL AMOUNT */}
      <div className="flex justify-between font-bold text-base">
        <span>Total Amount:</span>
        <span className="text-lg text-green-600">{Number(data.calculation.total || 0).toFixed(2)} บาท</span>
      </div>

      <hr className="my-4 border-dashed border-gray-300" />

      {/* QR CODE FOR CUSTOMER */}
      <div className="flex flex-col items-center justify-center bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-inner">
        <QRCodeCanvas value={orderUrl} size={180} />
        <p className="text-center mt-3 text-xs font-bold text-gray-500 tracking-wide uppercase">
          Scan QR เพื่อสั่งอาหาร
        </p>
      </div>
    </div>
  );
}
