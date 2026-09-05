import api from "./api";

// ==========================
// GET ALL STOCKS
// ==========================
export const getStocks = async () => {
  const res = await api.get("/stocks");
  return res.data;
};



// ==========================
// GET STOCK BY ID
// ==========================
export const getStockById = async (id) => {
  const res = await api.get(`/stocks/${id}`);
  return res.data;

};



// ==========================
// CREATE STOCK
// ==========================
export const createStock = async (data) => {
  const res = await api.post(
    "/stocks",
    data
  );

  return res.data;
};



// ==========================
// UPDATE STOCK
// ==========================
export const updateStock = async (id, data) => {
  const res = await api.put(
    `/stocks/${id}`,
    data
  );
  return res.data;

};



// ==========================
// DELETE STOCK
// ==========================
export const deleteStock = async (id) => {

  const res = await api.delete(
    `/stocks/${id}`
  );
  return res.data;
};



// ==========================
// INCREASE STOCK
// ==========================
export const increaseStock = async (id, quantity) => {
  const res = await api.put(
    `/stocks/${id}/increase`,
    {
      quantity
    }
  );
  return res.data;

};




// ==========================
// DECREASE STOCK
// ==========================
export const decreaseStock = async (id, quantity) => {
  const res = await api.put(
    `/stocks/${id}/decrease`,
    {
      quantity
    }
  );


  return res.data;

};




// ==========================
// UPLOAD EXCEL STOCK
// ==========================
export const uploadStockExcel = async (file) => {


  const formData = new FormData();
  formData.append(
    "file",
    file
  );

  const res = await api.post(
    "/stocks/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data;

};