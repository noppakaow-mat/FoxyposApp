import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
  getKPI,
  getDailySales,
  getMonthlySales,
  getTopProducts
} from "../../services/managerService";

import {
  formatKPI,
  formatDailySales,
  formatMonthlySales,
  formatTopProducts
} from "../../helpers/reportHelper";

const COLORS = ["#f59e0b", "#ef4444", "#3b82f6", "#10b981", "#a855f7"];

export default function DashboardScreen() {
  const [kpi, setKpi] = useState(null);
  const [daily, setDaily] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const [kpiRes, dailyRes, monthlyRes, topRes] = await Promise.all([
      getKPI(),
      getDailySales(),
      getMonthlySales(),
      getTopProducts()
    ]);

    setKpi(formatKPI(kpiRes));
    setDaily(formatDailySales(dailyRes));
    setMonthly(formatMonthlySales(monthlyRes));
    setTopProducts(formatTopProducts(topRes));

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-2xl font-bold text-green-600">
            ฿{kpi.revenue}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Orders</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {kpi.orders}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Avg Bill</p>
          <h2 className="text-2xl font-bold text-yellow-600">
            ฿{kpi.avgBill}
          </h2>
        </div>
      </div>

      {/* DAILY SALES */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-4">Daily Sales</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={daily}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* MONTHLY SALES */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-4">Monthly Sales Trend</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthly}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TOP PRODUCTS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-bold mb-4">Top Products</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topProducts}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {topProducts.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}