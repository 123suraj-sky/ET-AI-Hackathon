import api from "./api";

export const loginUser = async (loginData) => {
  return await api.post("/auth/login", loginData);
};

export const registerUser = async (registerData) => {
  return await api.post("/auth/register", registerData);
};