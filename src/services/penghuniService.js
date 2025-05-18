import api from "@/lib/axios";

export const getPenghuniByAset = async (asetId) => {
  const response = await api.get(`/wilayah/aset-penghuni/aset/${asetId}`);
  return response.data;
};
