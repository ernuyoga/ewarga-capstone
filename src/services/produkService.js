import api from "@/lib/axios";

export const getProdukById = async (id) => {
    const response = await api.get(`/umkm/produk/${id}`);
    return response.data;
};

export async function postProduk(formData) {
    return api.post('/umkm/produk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

const PRODUK_FORM_KEY = 'produk_form_data';

export function getProdukFormData() {
    const data = localStorage.getItem(PRODUK_FORM_KEY);
    return data ? JSON.parse(data) : {};
}

export function setProdukFormData(newData) {
    const current = getProdukFormData();
    const updated = { ...current, ...newData };
    localStorage.setItem(PRODUK_FORM_KEY, JSON.stringify(updated));
}

export function clearProdukFormData() {
    localStorage.removeItem(PRODUK_FORM_KEY);
}