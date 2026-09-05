import { useEffect, useState } from "react";

import Header from "../../components/manager/sidebar/Header";

import SummaryCards from "../../components/manager/dashboard/SummaryCards";
import RevenueChart from "../../components/manager/dashboard/RevenueChart";
import TopProductsTable from "../../components/manager/dashboard/TopProductsTable";
import MonthlySalesChart from "../../components/manager/dashboard/MonthlySalesChart";

import {
  getDashboardSummary,
  getTopProducts,
  getMonthlySales
} from "../../services/dashboardService";


export default function DashboardSceen() {

  const [summary, setSummary] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {
    loadDashboard();
  }, []);



  async function loadDashboard() {

    try {

      const [
        summaryData,
        topProductsData,
        monthlySalesData
      ] = await Promise.all([
        getDashboardSummary(),
        getTopProducts(),
        getMonthlySales()
      ]);


      setSummary(summaryData);

      setTopProducts(topProductsData);

      setMonthlySales(monthlySalesData);


    } catch (error) {

      console.error(
        "Dashboard loading error:",
        error
      );


    } finally {

      setLoading(false);

    }

  }

  if (loading) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  return (

    <div className="space-y-6">
      <Header title="Dashboard" />
      <SummaryCards
        data={summary}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <RevenueChart
          data={monthlySales}
        />

        <MonthlySalesChart
          data={monthlySales}
        />
      </div>

      <TopProductsTable
        products={topProducts}
      />


    </div>

  );
}