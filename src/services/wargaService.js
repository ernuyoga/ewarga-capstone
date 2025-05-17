import api from "@/lib/axios";

export const getAllWarga = () => api.get("/warga");
export const getWargaById = (id) => api.get(`/warga/${id}`);
export const updateWarga = (id, data) => api.put(`/warga/${id}`, data);