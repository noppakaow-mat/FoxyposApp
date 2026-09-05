import API from "./Api";

export const login = async (credentials) => {
  const { data } = await API.post("/auth/login", credentials);
  return data;
};