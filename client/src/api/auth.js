// client/src/api/auth.js
import api from "./api";


export const register = async (userData) => {
  const response = await api.post("/auth/create-account", userData);
  return response.data;
};

export const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
  return response.data;
};


export const logout = async () => {
  const response = await api.get("/auth/logout");
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.put(`/auth/reset-password/${token}`, { password });
  return response.data;
};

export const verifyResetPasswordToken = async (token) => {
  const response = await api.get(`/auth/reset-password/verify/${token}`);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put("/auth/change-password", data);
  return response.data;
}

