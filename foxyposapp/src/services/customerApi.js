import API from "./Api";


// GET MENU FOR CUSTOMER
export const getCustomerMenu = async (sessionId) => {
  const { data } = await API.get(`/menus/${sessionId}`);
  return data;
};


// SCAN QR MENU
export const scanCustomerMenu = async (sessionId) => {
  const { data } = await API.post("/menus/scan", {
    sessionId
  });

  return data;
};


// CREATE ORDER
export const createCustomerOrder = async (orderData) => {
  const { data } = await API.post("/orders", orderData);
  return data;
};


// GET CUSTOMER ORDERS
export const getCustomerOrders = async (sessionId) => {
  const { data } = await API.get(
    `/orders/session/${sessionId}`
  );

  return data.orders || [];
};


// GET ORDER HISTORY (alias)
export const getOrderHistory = getCustomerOrders;