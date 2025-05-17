import api from "@/lib/axios";

export const login = (credentials) => api.post("/login", credentials);
export const register = (data) => api.post("/register", data);
export const registerWarga = (data) => api.post("/warga/register", data);
export const logout = () => api.delete("/logout");