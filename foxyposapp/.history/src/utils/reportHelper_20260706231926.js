
/**
 * แปลง KPI ให้ง่ายต่อ UI
 */
export const formatKPI = (data) => {
  return {
    revenue: data.revenue || 0,
    orders: data.total_orders || 0,
    avgBill: data.avg_bill || 0
  };
};

/**
 * แปลง daily sales → Recharts Line/Bar chart
 */
export const formatDailySales = (data) => {
  return data.map((item) => ({
    date: item.date,
    revenue: Number(item.revenue)
  }));
};

/**
 * แปลง monthly sales → Bar chart
 */
export const formatMonthlySales = (data) => {
  return data.map((item) => ({
    month: item.month,
    revenue: Number(item.revenue)
  }));
};

/**
 * Top product → Pie / Bar chart
 */
export const formatTopProducts = (data) => {
  return data.map((item) => ({
    name: item.name,
    value: Number(item.total_sold)
  }));
};