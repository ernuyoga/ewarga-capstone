import api from "@/lib/axios";

export function getUmkmDashboard() {
  return api.get("/umkm/dashboard/summary");
}

export function getAllUmkm(params = {}) {
  return api.get("/umkm", { params });
}

export function getUmkmById(id) {
  return api.get(`/umkm/${id}`);
}

export function updateUmkm(id, data) {
  if (data instanceof FormData) {
    data.append('_method', 'PUT');
    return api.post(`/umkm/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  return api.put(`/umkm/${id}`, data);
}

export function deleteUmkm(id) {
  return api.delete(`/umkm/${id}`);
}

const UMKM_FORM_KEY = 'umkm_form_data';

export function getUmkmFormData() {
  const data = localStorage.getItem(UMKM_FORM_KEY);
  return data ? JSON.parse(data) : {};
}

export function setUmkmFormData(newData) {
  const current = getUmkmFormData();
  const updated = { ...current, ...newData };
  localStorage.setItem(UMKM_FORM_KEY, JSON.stringify(updated));
}

export function clearUmkmFormData() {
  localStorage.removeItem(UMKM_FORM_KEY);
}

const EDIT_UMKM_FORM_KEY = 'edit_umkm_form_data';

export function getEditUmkmFormData() {
  const data = localStorage.getItem(EDIT_UMKM_FORM_KEY);
  return data ? JSON.parse(data) : {};
}

export function setEditUmkmFormData(newData) {
  const current = getEditUmkmFormData();
  const updated = { ...current, ...newData };
  localStorage.setItem(EDIT_UMKM_FORM_KEY, JSON.stringify(updated));
}

export function clearEditUmkmFormData() {
  localStorage.removeItem(EDIT_UMKM_FORM_KEY);
}