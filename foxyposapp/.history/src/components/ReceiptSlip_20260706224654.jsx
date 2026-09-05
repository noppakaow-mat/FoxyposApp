import { QRCodeCanvas } from "qrcode.react";

export default function ReceiptSlip({ data }) {
  // กัน crash
  if (!data) return null;

  const subtotal = Number(data.total || 0);

  const vat = subtotal * 0.07;
  const grandTotal = subtotal + vat;

  const baseUrl =
    import.meta.env.VITE_APP_URL || "http://localhost:5173";

  return (
    <div
      id="receipt"
      className="bg-white text-black mx-auto p-4"
      style={{
        width: "300px",
        fontFamily: "monospace",
      }}
    >
      {/* HEADER */}
      <div className="text-center">
        <h2 className="font-bold text-lg">FOXY SHABU</h2>
        <p>Open Table Receipt</p>
        <hr className="my-3" />
      </div>

      {/* BODY */}
      <div className="space-y-1 text-sm">
        <p>Table : {data.table_number}</p>
        <p>Guest : {data.customer_count}</p>

        <hr className="my-3" />

        <p>Package :</p>
        <p className="font-bold">{data.package_name}</p>

        <p>
          {data.price} x {data.customer_count}
        </p>

        <hr className="my-3" />

        {/* TOTAL */}
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>VAT 7%</span>
          <span>{vat.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-bold text-base">
          <span>Grand Total</span>
          <span>{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* QR */}
      <div className="flex justify-center mt-5">
        <QRCodeCanvas
          size={180}
          value={`${baseUrl}/customer/menu/${data.table_id}`}
        />
      </div>

      <p className="text-center text-xs mt-3">
        Scan QR to Order Food
      </p>
    </div>
  );
}