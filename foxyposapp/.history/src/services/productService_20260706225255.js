// src/services/productService.js

const API_URL = "http://localhost:5000/api"; // เปลี่ยนตาม backend นาย

export const getMenuByCategory = async (sessionId) => {
  try {
    const res = await fetch(`${API_URL}/menu?sessionId=${sessionId}`);
    return await res.json();
  } catch (err) {
    console.error("getMenuByCategory error:", err);
    return [];
  }
};

export const createOrder = async (payload) => {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (err) {
    console.error("createOrder error:", err);
    return null;
  }
};