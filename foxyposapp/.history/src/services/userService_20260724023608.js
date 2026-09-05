import api from "./api";

//get all user
export const getUsers = () => api.get("/users");

export const createUser = (data) =>
  api.post("/users", data);

export const updateRole = (id, role) =>
  api.patch(`/users/${id}/role`, { role });

export const deleteUser = (id) =>
  api.delete(`/users/${id}`);