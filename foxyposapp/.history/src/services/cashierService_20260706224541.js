// cashierService.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * ดึงข้อมูลโต๊ะทั้งหมด
 */
export async function getTables() {
  const res = await fetch(`${API_URL}/tables`);
  if (!res.ok) throw new Error("Failed to fetch tables");
  return res.json();
}

/**
 * เปิดโต๊ะ + เริ่ม session
 * body: { table_id, customer_count, package_id }
 */
export async function openTable(payload) {
  const res = await fetch(`${API_URL}/tables/open`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to open table");
  return res.json();
}