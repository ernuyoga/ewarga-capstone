import api from "@/lib/axios";

export const getUmkmMaster = () => {
    return api.get("/umkm/umkm-master/index", {
        params: {
            data: "jenis,bentuk,kontak"
        }
    });
};

export const getAsetMaster = () => {
    return api.get("/aset/aset-master", {
        params: {
            data: "jenis,status"
        }
    });
}