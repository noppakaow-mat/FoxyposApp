import API from "./Api";

//  MENU 

export const getMenuByCategory = async (sessionId) => {
  try {
    const { data } = await API.get("/menu", {
      params: {
        sessionId,
      },
    });

    return data;
  } catch (err) {
    console.error("getMenuByCategory error:", err);
    return [];
  }
};

//  ORDER 

export const createOrder = async (payload) => {
  try {
    const { data } = await API.post("/orders", payload);
    return data;
  } catch (err) {
    console.error("createOrder error:", err);
    return null;
  }
};