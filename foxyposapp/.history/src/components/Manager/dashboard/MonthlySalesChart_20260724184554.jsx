import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";


export default function MonthlySalesChart({ data = [] }) {
    return (
        <section className="bg-white rounded-2xl shadow-sm p-6">

            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                    Monthly Sales
                </h2>

                <p className="text-sm text-gray-500">
                    ยอดขายรายเดือน
                </p>
            </div>


            <ResponsiveContainer width="100%" height={300}>

                <BarChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10
                    }}
                >

                    <CartesianGrid strokeDasharray="3 3" />


                    <XAxis dataKey="month" />


                    <YAxis
                        tickFormatter={(value) => `฿${value}`}
                    />


                    <Tooltip
                        formatter={(value) => [
                            `฿${value.toLocaleString()}`,
                            "Sales"
                        ]}
                    />


                    <Bar
                        dataKey="sales"
                        radius={[8, 8, 0, 0]}
                    />


                </BarChart>

            </ResponsiveContainer>

        </section>
    );
}