import api from "./api";

// Get all products
export const getStocks = async () => {
  const res = await api.get("/stocks");
  return res.data;
};

// Get product by id
export const getStockById = async (id) => {
  const res = await api.get(`/stocks/${id}`);
  return res.data;
};

// Create product
export const createStock = async (data) => {
  const res = await api.post("/stocks", data);
  return res.data;
};

// Update product
export const updateStock = async (id, data) => {
  const res = await api.put(`/stocks/${id}`, data);
  return res.data;
};

// Delete product
export const deleteStock = async (id) => {
  const res = await api.delete(`/stocks/${id}`);
  return res.data;
};

// Increase stock
export const increaseStock = async (id, quantity) => {
  const res = await api.patch(`/stocks/${id}/increase`, {
    quantity,
  });

  return res.data;
};

// Decrease stock
export const decreaseStock = async (id, quantity) => {
  const res = await api.patch(`/stocks/${id}/decrease`, {
    quantity,
  });

  return res.data;
};