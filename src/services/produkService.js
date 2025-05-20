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

export async function putProduk(id, formData) {
    return api.post(`/umkm/produk/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export function deleteProduk(id) {
    return api.delete(`/umkm/produk/${id}`);
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

const EDIT_PRODUK_FORM_KEY = 'edit_produk_form_data';

export function getEditProdukFormData() {
    const data = localStorage.getItem(EDIT_PRODUK_FORM_KEY);
    return data ? JSON.parse(data) : {};
}

export function setEditProdukFormData(newData) {
    const current = getEditProdukFormData();
    const updated = { ...current, ...newData };
    localStorage.setItem(EDIT_PRODUK_FORM_KEY, JSON.stringify(updated));
}

export function clearEditProdukFormData() {
    localStorage.removeItem(EDIT_PRODUK_FORM_KEY);
}

export function mapProdukDetailToForm(data) {
    return {
        id: data.id,
        umkm_id: data.umkm_id,
        instansi_id: data.instansi_id,
        nama: data.nama || "",
        keterangan: data.keterangan || "",
        harga: data.harga || "",
        fotos: data.fotos || [],
        // Untuk hapus foto, default kosong
        hapus_foto: []
    };
}