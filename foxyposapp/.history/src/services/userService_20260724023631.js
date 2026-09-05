import api from "./api";

//get all user
export const getUsers = () => api.get("/users");
// create user
export const createUser = (data) =>
  api.post("/users", data);
// role
export const updateRole = (id, role) =>
  api.patch(`/users/${id}/role`, { role });
// deleteuser
export const deleteUser = (id) =>
  api.delete(`/users/${id}`);