import api from "@/lib/axios";

export function getUmkmDashboardSummary() {
  return api.get("/umkm/dashboard/summary");
}

export function getAllUmkm(params = {}) {
  return api.get("/umkm", { params });
}

export function getUmkmById(id) {
  return api.get(`/umkm/${id}`);
}

