const API_URL = import.meta.env.VITE_API_URL || "http://localhost:000/api";

// ===== TOKEN =====
const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

// ================= USER MANAGEMENT =================

export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`, {
    headers: headers()
  });
  return res.json();
};

export const createUser = async (data) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  });
  return res.json();
};

export const updateUserRole = async (id, role) => {
  const res = await fetch(`${API_URL}/users/${id}/role`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ role })
  });
  return res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: headers()
  });
  return res.json();
};

// ================= STOCK =================

export const uploadStockExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/stock/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  });

  return res.json();
};

// ================= REPORT =================

export const getKPI = async () => {
  const res = await fetch(`${API_URL}/reports/kpi`, {
    headers: headers()
  });
  return res.json();
};

export const getDailySales = async () => {
  const res = await fetch(`${API_URL}/reports/daily`, {
    headers: headers()
  });
  return res.json();
};

export const getMonthlySales = async () => {
  const res = await fetch(`${API_URL}/reports/monthly`, {
    headers: headers()
  });
  return res.json();
};

export const getTopProducts = async () => {
  const res = await fetch(`${API_URL}/reports/top-products`, {
    headers: headers()
  });
  return res.json();
};