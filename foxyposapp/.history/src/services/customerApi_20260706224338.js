import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

export const getMenus = () => API.get("/menus");

export const getCategories = () => API.get("/categories");

export const createOrder = (data) =>
    API.post("/orders", data);