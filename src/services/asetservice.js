import api from '@/lib/axios'

export async function postAset(data) {
  const formData = new FormData();
  formData.append("warga_id", data.pemilik_id);
  formData.append("instansi_id", data.instansi_id);
  formData.append("aset_m_jenis_id", data.jenis_id);
  formData.append("nama", data.nama);
  formData.append("alamat", data.alamat);

  if (Array.isArray(data.fotos)) {
    data.fotos.forEach((imgObj, idx) => {
      if (imgObj.rawFile instanceof File) {
        formData.append(`fotos[${idx}]`, imgObj.rawFile);
      }
    });
  }

  if (Array.isArray(data.hapus_foto)) {
    data.hapus_foto.forEach((id, idx) => {
      formData.append(`hapus_foto[${idx}]`, id);
    });
  }

  return api.post("/wilayah/aset/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateAset(id, data) {
  const formData = new FormData();
  formData.append("warga_id", data.pemilik_id);
  formData.append("instansi_id", data.instansi_id);
  formData.append("aset_m_jenis_id", data.jenis_id);
  formData.append("nama", data.nama);
  formData.append("alamat", data.alamat);

  if (Array.isArray(data.fotos)) {
    data.fotos.forEach((imgObj, idx) => {
      if (imgObj.rawFile instanceof File) {
        formData.append(`fotos[${idx}]`, imgObj.rawFile);
      }
    });
  }

  if (Array.isArray(data.hapus_foto)) {
    data.hapus_foto.forEach((id, idx) => {
      formData.append(`hapus_foto[${idx}]`, id);
    });
  }

  formData.append('_method', 'PUT');
  return api.post(`/wilayah/aset/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function getAsetLokasi(id) {
  return api.get(`/wilayah/aset/${id}/lokasi`);
}

export async function updateAsetLokasi(id, latitude, longitude) {
  const formData = new FormData();
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);
  formData.append('_method', 'PUT');
  return api.post(`/wilayah/aset/${id}/lokasi`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

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
  localStorage.removeItem('fotos');
  localStorage.removeItem('gambar');
}

const ASET_EDIT_FORM_KEY = 'aset_edit_form_data';

export function getAsetEditFormData() {
  const data = localStorage.getItem(ASET_EDIT_FORM_KEY);
  return data ? JSON.parse(data) : {};
}

export function setAsetEditFormData(newData) {
  const current = getAsetEditFormData();
  const updated = { ...current, ...newData };
  localStorage.setItem(ASET_EDIT_FORM_KEY, JSON.stringify(updated));
}

export function clearAsetEditFormData() {
  localStorage.removeItem(ASET_EDIT_FORM_KEY);
}