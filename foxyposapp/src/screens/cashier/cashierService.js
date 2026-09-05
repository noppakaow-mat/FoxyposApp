import { API_URL } from "../../services/Api";

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// GET TABLES
export async function getTables() {
  const res = await fetch(`${API_URL}/tables`, {
    headers: getHeaders()
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Load tables failed");
  }

  return data;
}

// OPEN TABLE
export async function openTable(payload) {
  const res = await fetch(`${API_URL}/tables/open`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Open table failed");
  }

  return data;
}

// CHECKOUT TABLE
export async function checkoutTable(table_id) {
  const res = await fetch(`${API_URL}/tables/checkout`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ table_id })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Checkout failed");
  }

  return data;
}

// GET RECEIPT

export async function getReceipt(sessionId){
  const res = await fetch(
    `${API_URL}/tables/receipt/${sessionId}`,
    {
      headers:getHeaders()
    }
  );
  return await res.json();
}