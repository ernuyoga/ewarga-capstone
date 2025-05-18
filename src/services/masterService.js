import api from "@/lib/axios";

export const getUmkmMaster = () => {
    return api.get("/umkm/umkm-master/index", {
        params: {
            data: "jenis,bentuk,kontak"
        }
    });
};