import axios from "axios";

const API = "http://localhost:5000/api";

export const getTables = async () => {
    const res = await axios.get(`${API}/tables`);
    return res.data;
};

export const openTable = async (data) => {
    const res = await axios.post(`${API}/tables/open`, data);
    return res.data;
};