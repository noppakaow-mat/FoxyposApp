import { QRCodeCanvas } from "qrcode.react";

export default function ReceiptSlip({ data }) {
    if (!data) return null;

    const subtotal = data.people * data.package.price;
    const vat = subtotal * 0.07;
    const total = subtotal + vat;

    return (
        <div
            id="receipt"
            className="w-[300px] bg-white text-black p-4 font-mono border border-gray-300 print:border-0"
        >
            <div className="text-center">
                <h1 className="text-xl font-bold">FOXY POS</h1>
                <p className="text-xs">Restaurant Buffet</p>
            </div>

            <div className="border-t border-dashed border-black my-3"></div>

            <div className="space-y-1 text-sm">

                <div className="flex justify-between">
                    <span>Table</span>
                    <span>{data.table_no}</span>
                </div>

                <div className="flex justify-between">
                    <span>Guests</span>
                    <span>{data.people}</span>
                </div>

                <div className="flex justify-between">
                    <span>Package</span>
                    <span>{data.package.name}</span>
                </div>

                <div className="flex justify-between">
                    <span>Price / Person</span>
                    <span>{data.package.price} ฿</span>
                </div>

            </div>

            <div className="border-t border-dashed border-black my-3"></div>

            <div className="space-y-1 text-sm">

                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                    <span>VAT 7%</span>
                    <span>{vat.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total</span>
                    <span>{total.toFixed(2)}</span>
                </div>

            </div>

            <div className="flex justify-center my-5">
                <QRCodeCanvas
                    value={`https://foxypos.app/order/${data.table_id}`}
                    size={140}
                />
            </div>

            <p className="text-center text-xs">
                Scan QR to Order
            </p>
        </div>
    );
}