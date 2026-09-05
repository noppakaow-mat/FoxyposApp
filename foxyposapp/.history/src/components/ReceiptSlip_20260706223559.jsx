import { QRCodeCanvas } from "qrcode.react";

export default function ReceiptSlip({ data }) {
    if (!data) return null;

    const subtotal = data.people * data.package.price;
    const vat = Math.round(subtotal * 0.07 * 100) / 100;
    const total = subtotal + vat;

    return (
        <div
            id="receipt"
            className="w-[300px] mx-auto"
            style={{ fontFamily: "monospace" }}
        >
            <style>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    #receipt {
                        width: 80mm;
                        margin: 0 auto;
                        padding: 0;
                        background: white;
                    }
                    .no-print {
                        display: none;
                    }
                }
            `}</style>

            <div className="bg-white text-black p-3 border border-dashed border-gray-300" style={{ width: "300px" }}>
                {/* Header */}
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-3">
                    <h1 className="text-sm font-bold leading-tight">FOXY POS</h1>
                    <p className="text-xs text-gray-600 leading-tight">Restaurant Buffet</p>
                    <p className="text-xs text-gray-500">Opening Slip</p>
                </div>

                {/* Receipt Number & Date */}
                <div className="text-xs text-center my-2 leading-tight">
                    <p>Receipt No: {data.table_id}</p>
                    <p>{new Date().toLocaleString("th-TH")}</p>
                </div>

                {/* Table Info */}
                <div className="border-t border-b border-dashed border-gray-300 py-2 my-2">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold">Table:</span>
                        <span className="font-bold text-lg">{data.table_no}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-semibold">Guests:</span>
                        <span className="font-bold">{data.people} people</span>
                    </div>
                </div>

                {/* Package Details */}
                <div className="my-3">
                    <div className="text-xs font-semibold mb-1">Package Details</div>
                    <div className="border border-dashed border-gray-300 p-2 bg-gray-50">
                        <div className="text-sm font-bold mb-2">{data.package.name}</div>
                        <div className="flex justify-between text-xs mb-1">
                            <span>Price/Person:</span>
                            <span>{data.package.price} ฿</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>Qty:</span>
                            <span>{data.people} person(s)</span>
                        </div>
                    </div>
                </div>

                {/* Calculation */}
                <div className="border-t border-b border-dashed border-gray-300 py-2 my-2">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Subtotal:</span>
                        <span className="font-semibold">{subtotal.toFixed(2)} ฿</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>VAT 7%:</span>
                        <span className="font-semibold">{vat.toFixed(2)} ฿</span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t border-dashed border-gray-300 pt-2">
                        <span>Total:</span>
                        <span className="text-lg">{total.toFixed(2)} ฿</span>
                    </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center my-4 p-2 bg-gray-50 border border-dashed border-gray-300 rounded">
                    <QRCodeCanvas
                        value={`https://foxypos.app/order/${data.table_id}`}
                        size={120}
                        level="H"
                        includeMargin={true}
                    />
                </div>

                {/* Footer */}
                <div className="text-center border-t border-dashed border-gray-300 pt-2">
                    <p className="text-xs font-semibold mb-1">Scan QR Code to Order</p>
                    <p className="text-xs text-gray-600">Thank you!</p>
                    <p className="text-xs text-gray-500 mt-1">FOXY POS v1.0</p>
                </div>
            </div>
        </div>
    );
}