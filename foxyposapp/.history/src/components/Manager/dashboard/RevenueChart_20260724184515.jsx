import { Trophy } from "lucide-react";

export default function TopProductsTable({ products = [] }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-6">

      <div className="flex items-center gap-3 mb-6">
        <Trophy size={22} className="text-yellow-500" />

        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Top Products
          </h2>

          <p className="text-sm text-gray-500">
            สินค้าขายดี
          </p>
        </div>
      </div>


      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead>
            <tr className="border-b text-gray-500">

              <th className="py-3 text-left">
                #
              </th>

              <th className="py-3 text-left">
                รายการ
              </th>

              <th className="py-3 text-center">
                จำนวนขาย
              </th>

              <th className="py-3 text-right">
                รายได้
              </th>

            </tr>
          </thead>


          <tbody>

            {products.length > 0 ? (
              products.map((product, index) => (
                <tr
                  key={product.id || index}
                  className="border-b last:border-none"
                >

                  <td className="py-4 font-semibold text-gray-700">
                    {index + 1}
                  </td>


                  <td className="py-4 font-medium text-gray-800">
                    {product.name}
                  </td>


                  <td className="py-4 text-center text-gray-600">
                    {product.sold}
                  </td>


                  <td className="py-4 text-right font-semibold text-gray-800">
                    ฿{product.revenue?.toLocaleString()}
                  </td>

                </tr>
              ))

            ) : (

              <tr>
                <td
                  colSpan="4"
                  className="py-8 text-center text-gray-400"
                >
                  ไม่มีข้อมูลสินค้า
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}