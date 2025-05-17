import api from "@/lib/axios";

export const getAllInstansi = () => api.get("/instansi");
export const getInstansiById = (id) => api.get(`/instansi/${id}`);