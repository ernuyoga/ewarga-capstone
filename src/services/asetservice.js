import api from '@/lib/axios'

const ASET_FORM_KEY = 'aset_form_data';

export function getAsetFormData() {
  const data = localStorage.getItem(ASET_FORM_KEY);
  return data ? JSON.parse(data) : {};
}

export function setAsetFormData(newData) {
  const current = getAsetFormData();
  const updated = { ...current, ...newData };
  localStorage.setItem(ASET_FORM_KEY, JSON.stringify(updated));
}

export function clearAsetFormData() {
  localStorage.removeItem(ASET_FORM_KEY);
}

export async function postAset(data) {
  const formData = new FormData();
  formData.append("warga_id", data.pemilik_id);
  formData.append("instansi_id", data.instansi_id); 
  formData.append("aset_m_jenis_id", data.jenis_id); 
  formData.append("nama", data.nama);
  formData.append("alamat", data.alamat);

  if (Array.isArray(data.gambar)) {
    data.gambar.forEach((imgObj, idx) => {
      if (imgObj.rawFile instanceof File) {
        formData.append(`fotos[${idx}]`, imgObj.rawFile);
      }
    });
  }

  // POST ke endpoint /wilayah/aset/
  return api.post("/wilayah/aset/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}