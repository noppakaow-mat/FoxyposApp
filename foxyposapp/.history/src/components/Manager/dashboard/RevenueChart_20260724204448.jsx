import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";


export default function RevenueChart({ data = [] }) {

    return (
        <div className="
      bg-white
      rounded-2xl
      shadow-sm
      p-6
      w-full
    ">

            <div className="mb-5">
                <h2 className="
          text-lg
          font-bold
          text-gray-800
        ">
                    Revenue Overview
                </h2>

                <p className="
          text-sm
          text-gray-500
        ">
                    รายได้ย้อนหลัง
                </p>
            </div>


            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <LineChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10
                    }}
                >

                    <CartesianGrid
                        strokeDasharray="3 3"
                    />


                    <XAxis
                        dataKey="date"
                    />


                    <YAxis
                        tickFormatter={(value) => `฿${value}`}
                    />


                    <Tooltip
    formatter={(value) => [
        `฿${Number(value).toLocaleString()}`,
        "Revenue"
    ]}
/>


                    <Line
                        type="monotone"
                        dataKey="revenue"
                        strokeWidth={3}
                        dot={{
                            r: 4
                        }}
                    />


                </LineChart>


            </ResponsiveContainer>


        </div>
    );
}