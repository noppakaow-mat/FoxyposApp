import { QRCodeCanvas } from "qrcode.react";

export default function ReceiptSlip({ data }) {

    const vat = data.total * 0.07;

    const grandTotal = data.total + vat;

    return (

        <div
            id="receipt"

            className="bg-white text-black mx-auto p-4"

            style={{
                width:"300px",
                fontFamily:"monospace"
            }}
        >

            <div className="text-center">

                <h2 className="font-bold text-lg">
                    FOXY SHABU
                </h2>

                <p>Open Table Receipt</p>

                <hr className="my-3"/>

            </div>

            <div className="space-y-1">

                <p>Table : {data.table_number}</p>

                <p>Guest : {data.customer_count}</p>

                <p>Package :</p>

                <p>{data.package_name}</p>

                <p>{data.price} x {data.customer_count}</p>

                <hr className="my-3"/>

                <div className="flex justify-between">
                    <span>Total</span>
                    <span>{data.total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                    <span>VAT 7%</span>
                    <span>{vat.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-bold">

                    <span>Grand Total</span>

                    <span>{grandTotal.toFixed(2)}</span>

                </div>

            </div>

            <div className="flex justify-center mt-5">

                <QRCodeCanvas
                    size={180}
                    value={`http://localhost:5173/customer/menu/${data.table_id}`}
                />

            </div>

            <p className="text-center text-xs mt-3">
                Scan QR to Order Food
            </p>

        </div>

    );
}