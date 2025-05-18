import api from "@/lib/axios";

export function getAllAsetByInstansi(instansiId) {
  return api.get(`/wilayah/aset/instansi/${instansiId}`);
}

export function getAsetById(id) {
  return api.get(`/wilayah/aset/${id}`);
}