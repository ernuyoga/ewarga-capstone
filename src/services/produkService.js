import api from "@/lib/axios";

export const getProdukById = async (id) => {
    const response = await api.get(`/umkm/produk/${id}`);
    return response.data;
};