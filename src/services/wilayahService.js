import api from "@/lib/axios";

export function getWilayahDashboard() {
  return api.get("/wilayah/dashboard/aset-statistics");
}

export function getAllAsetByInstansi(instansiId) {
  return api.get(`/wilayah/aset/instansi/${instansiId}`);
}

export function getAsetById(id) {
  return api.get(`/wilayah/aset/${id}`);
}

export function searchAsetByName(name, instansiId) {
  return api.get(`/wilayah/aset/search/by-name`, {
    params: { name, instansi_id: instansiId }
  });
}

export function createAset(data) {
  return api.post("/wilayah/aset", data);
}

export function updateAset(id, data) {
  return api.put(`/wilayah/aset/${id}`, data);
}

export function deleteAset(id) {
  return api.delete(`/wilayah/aset/${id}`);
}