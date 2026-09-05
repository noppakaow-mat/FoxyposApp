import axios from "axios";

export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || `http://${window.location.hostname}:3000`;
export const API_URL = `${API_ORIGIN}/api`;

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use((config)=>{

  const token = localStorage.getItem("token");

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default API;
