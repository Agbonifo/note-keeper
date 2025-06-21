// client/src/api/users.js
import api from "./api";

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const deleteUser = async (password) => { 
  const response = await api.delete("/users/me", {data: { password }});
  return response.data;
}
