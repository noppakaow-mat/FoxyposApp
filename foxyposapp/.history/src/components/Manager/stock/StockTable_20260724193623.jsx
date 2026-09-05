import StockStatusBadge from "./StockStatusBadge";


export default function StockTable({ stocks = [] }) {

    return (
        <section className="bg-white rounded-2xl shadow-sm p-6">

            <div className="mb-6">

                <h2 className="text-lg font-bold text-gray-800">
                    Stock Management
                </h2>

                <p className="text-sm text-gray-500">
                    รายการวัตถุดิบและจำนวนคงเหลือ
                </p>

            </div>


            <div className="overflow-x-auto">

                <table className="w-full text-sm">

                    <thead>

                        <tr className="border-b text-gray-500">

                            <th className="py-3 text-left">
                                #
                            </th>

                            <th className="py-3 text-left">
                                สินค้า
                            </th>

                            <th className="py-3 text-center">
                                จำนวน
                            </th>

                            <th className="py-3 text-center">
                                หน่วย
                            </th>

                            <th className="py-3 text-center">
                                สถานะ
                            </th>

                            <th className="py-3 text-right">
                                อัปเดตล่าสุด
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {stocks.length > 0 ? (

                            stocks.map((item, index) => (

                                <tr
                                    key={item.id || index}
                                    className="border-b last:border-none"
                                >

                                    <td className="py-4 font-semibold text-gray-700">
                                        {index + 1}
                                    </td>


                                    <td className="py-4 font-medium text-gray-800">
                                        {item.name}
                                    </td>


                                    <td className="py-4 text-center text-gray-600">
                                        {item.quantity}
                                    </td>


                                    <td className="py-4 text-center text-gray-600">
                                        {item.unit}
                                    </td>


                                    <td className="py-4 text-center">

                                        <StockStatusBadge
                                            status={item.status}
                                        />

                                    </td>


                                    <td className="py-4 text-right text-gray-500">
                                        {item.updated_at}
                                    </td>


                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="py-8 text-center text-gray-400"
                                >
                                    ไม่มีข้อมูล Stock
                                </td>

                            </tr>

                        )}

                    </tbody>


                </table>

            </div>

        </section>
    );
}