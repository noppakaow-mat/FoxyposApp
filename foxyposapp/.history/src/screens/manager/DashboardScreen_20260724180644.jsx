import { useEffect, useState } from "react";
import Sidebar from "../../components/manager/Sidebar";
import Header from "../../components/manager/Header";
import SummaryCards from "../../components/manager/dashboard/SummaryCards";

import { getDashboardSummary } from "../../services/dashboardService";

export default function DashboardPage() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="p-6">
          <SummaryCards
            todayRevenue={summary.todayRevenue}
            monthRevenue={summary.monthRevenue}
            activeTables={summary.activeTables}
            todayOrders={summary.todayOrders}
          />
        </div>
      </div>
    </div>
  );
}