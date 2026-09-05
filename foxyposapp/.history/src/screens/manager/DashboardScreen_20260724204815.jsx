import { useEffect, useState } from "react";

import SummaryCards from "../../components/manager/dashboard/SummaryCards";
import RevenueChart from "../../components/manager/dashboard/RevenueChart";
import MonthlySalesChart from "../../components/manager/dashboard/MonthlySalesChart";
import TopProductsTable from "../../components/manager/dashboard/TopProductsTable";

import {
  getDashboardSummary,
  getTopProducts,
  getMonthlySales,
} from "../../services/dashboardService";


export default function DashboardScreen() {

  const [summary, setSummary] = useState({
    todayRevenue: 0,
    monthRevenue: 0,
    activeTables: 0,
    todayOrders: 0,
  });

  const [revenueData, setRevenueData] = useState([]);

  const [monthlySales, setMonthlySales] = useState([]);

  const [topProducts, setTopProducts] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {
    loadDashboard();
  }, []);



  async function loadDashboard() {

    try {

      const [
        summaryData,
        topProductsData,
        monthlySalesData,
      ] = await Promise.all([
        getDashboardSummary(),
        getTopProducts(),
        getMonthlySales(),
      ]);


      console.log("SUMMARY:", summaryData);
      console.log("MONTHLY:", monthlySalesData);
      console.log("TOP:", topProductsData);



      // Summary

      setSummary(summaryData);



      // สำหรับ Line Chart

      const revenueChart = monthlySalesData.map((item) => ({
        date:
          item.date ||
          item.month ||
          "",

        revenue:
          Number(
            item.revenue ||
            item.sales ||
            item.total ||
            item.total_sales ||
            0
          ),
      }));


      setRevenueData(revenueChart);



      // สำหรับ Bar Chart

      const salesChart = monthlySalesData.map((item) => ({
        month:
          item.month ||
          item.date ||
          "",

        sales:
          Number(
            item.sales ||
            item.revenue ||
            item.total ||
            item.total_sales ||
            0
          ),
      }));


      setMonthlySales(salesChart);



      setTopProducts(
        Array.isArray(topProductsData)
          ? topProductsData
          : []
      );


    } catch (error) {

      console.error(
        "Dashboard error:",
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


      <SummaryCards
        todayRevenue={summary.todayRevenue}
        monthRevenue={summary.monthRevenue}
        activeTables={summary.activeTables}
        todayOrders={summary.todayOrders}
      />



      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


        <RevenueChart
          data={revenueData}
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