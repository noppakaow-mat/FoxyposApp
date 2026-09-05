import api from "./Api";

// Dashboard Summary
export const getDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return res.data;
};

// Top Products
export const getTopProducts = async () => {
  const res = await api.get("/dashboard/top-products");
  return res.data;
};

// Monthly Sales
export const getMonthlySales = async () => {
  const res = await api.get("/dashboard/monthly-sales");
  return res.data;
};

export const getRevenue = async () => {
  const res = await api.get("/dashboard/revenue");
  return res.data;
};