import api from "@/lib/axios";

export const getAllWarga = () => api.get("/warga");
export const getWargaById = (id) => api.get(`/warga/${id}`);


export const updateWargaForm = (id, dataObj) => {
    const fd = new FormData();
    fd.append('_method', 'PUT');
    const allowed = [
        'instansi_id', 'nama', 'nik', 'no_kk', 'no_tlp',
        'tempat_lahir', 'tgl_lahir', 'jenis_kelamin', 'alamat', 'foto'
    ];
    allowed.forEach(key => {
        if (dataObj[key] !== undefined && dataObj[key] !== null && dataObj[key] !== '') {
            if (key === 'foto' && dataObj[key] instanceof File) {
                fd.append(key, dataObj[key]);
            } else if (key !== 'foto') {
                fd.append(key, dataObj[key]);
            }
        }
    });
    return api.post(`/warga/${id}`, fd, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

