import api from "@/lib/axios";

export const getPenghuniByAset = async (asetId) => {
  const response = await api.get(`/wilayah/aset-penghuni/aset/${asetId}`);
  return response.data;
};

export async function updateAsetPenghuni(id, penghuniArr) {
  return api.put(`/wilayah/aset-penghuni/${id}`, {
    penghuni: penghuniArr.map(p => ({
      warga_id: p.warga_id,
      aset_m_status_id: p.aset_m_status_id
    }))
  });
}

export const deleteAset = async (asetId) => {
  return api.delete(`/wilayah/aset/${asetId}`);
};

const ASET_PENGHUNI_KEY = 'aset_penghuni_data';

export function setAsetPenghuniData(data) {
  localStorage.setItem(ASET_PENGHUNI_KEY, JSON.stringify(data));
}
export function getAsetPenghuniData() {
  return JSON.parse(localStorage.getItem(ASET_PENGHUNI_KEY) || '[]');
}
export function clearAsetPenghuniData() {
  localStorage.removeItem(ASET_PENGHUNI_KEY);
}
