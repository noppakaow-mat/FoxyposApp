import { useEffect, useState } from "react";

import SummaryCards from "../../components/manager/dashboard/SummaryCards";
import RevenueChart from "../../components/manager/dashboard/RevenueChart";
import TopProductsTable from "../../components/manager/dashboard/TopProductsTable";
import MonthlySalesChart from "../../components/manager/dashboard/MonthlySalesChart";

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
        monthlySalesData,
      ] = await Promise.all([

        getDashboardSummary(),

        getTopProducts(),

        getMonthlySales(),

      ]);



      console.log(
        "SUMMARY",
        summaryData
      );


      console.log(
        "MONTHLY SALES",
        monthlySalesData
      );


      console.log(
        "TOP PRODUCTS",
        topProductsData
      );



      setSummary({

        todayRevenue:
          summaryData.todayRevenue || 0,

        monthRevenue:
          summaryData.monthRevenue || 0,

        activeTables:
          summaryData.activeTables || 0,

        todayOrders:
          summaryData.todayOrders || 0,

      });



      setTopProducts(

        Array.isArray(topProductsData)
          ? topProductsData
          : []

      );



      // แปลงข้อมูลสำหรับ Recharts

      const chartData =
        Array.isArray(monthlySalesData)

          ? monthlySalesData.map((item) => ({

              date:
                item.date ||
                item.month ||
                item.created_at ||
                "",


              revenue:
                Number(
                  item.revenue ||
                  item.total ||
                  item.amount ||
                  0
                ),

            }))

          : [];



      setMonthlySales(chartData);



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


      <SummaryCards

        todayRevenue={
          summary.todayRevenue
        }

        monthRevenue={
          summary.monthRevenue
        }

        activeTables={
          summary.activeTables
        }

        todayOrders={
          summary.todayOrders
        }

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