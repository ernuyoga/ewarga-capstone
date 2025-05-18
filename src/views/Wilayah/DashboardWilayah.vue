<template>
    <div class="max-w-[400px] mx-auto min-h-screen bg-[#f7f7fa] p-4">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4 gap-2">
            <h2 class="text-lg font-semibold">Pemetaan Wilayah</h2>
        </div>

        <!-- Statistik -->
        <div class="flex items-center justify-between bg-white rounded-lg shadow p-4 mb-4">
            <div>
                <div class="text-xs text-gray-500">Total Objek</div>
                <div class="text-3xl font-bold">{{ dashboard.totalObjek }}</div>
            </div>
            <div class="text-right">
                <div class="text-xs text-gray-500">Pertumbuhan sepanjang tahun</div>
                <div class="flex items-center justify-end">
                    <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    <span class="text-green-500 font-semibold text-lg mr-1">{{ dashboard.pertumbuhan }}%</span>
                </div>
            </div>
        </div>

        <!-- Search -->
        <div class="mb-4">
            <input v-model="search" type="text" placeholder="Cari nama aset..."
                class="w-full border rounded-lg px-4 py-2" />
        </div>

        <!-- Skeleton Loader -->
        <template v-if="loading">
            <div v-for="n in 3" :key="n" class="bg-white rounded-lg shadow mb-4 flex animate-pulse">
                <div class="w-24 h-24 bg-gray-200 rounded-l-lg"></div>
                <div class="p-3 flex-1">
                    <div class="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        </template>

        <!-- List Aset -->
        <template v-else>
            <div v-for="aset in dashboard.aset" :key="aset.id" class="bg-white rounded-lg shadow mb-4 flex"
                @click="goToAsetDetail(aset.id)" style="cursor:pointer">
                <img :src="aset.foto" alt="foto aset" class="w-24 h-24 object-cover rounded-l-lg" />
                <div class="p-3 flex-1">
                    <div class="font-semibold text-base">{{ aset.nama }}</div>
                    <div class="text-xs text-gray-500 mb-1">{{ aset.jenis }} | {{ aset.pemilik }}</div>
                    <div class="text-xs text-gray-500 mb-1">{{ aset.lokasi }}</div>
                    <div class="text-xs text-gray-400">{{ aset.alamat }}</div>
                </div>
            </div>
            <div v-if="!loading && hasFetched && dashboard.aset.length === 0" class="text-center text-gray-500 mt-6">
                Data aset tidak ditemukan.
            </div>
        </template>
    </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { getWilayahDashboard, getAllAsetByInstansi, searchAsetByName } from "@/services/wilayahService";
import { getWargaById } from "@/services/wargaService";
import { useAuthStore } from "@/store/auth";

export default {
    name: "DashboardWilayah",
    setup() {
        const dashboard = ref({
            totalObjek: 0,
            pertumbuhan: 0,
            aset: [],
        });
        const search = ref("");
        const instansiId = ref(null);
        const auth = useAuthStore();
        const loading = ref(false);
        const hasFetched = ref(false);
        const router = useRouter();

        const fetchDashboard = async () => {
            try {
                const res = await getWilayahDashboard();
                dashboard.value.totalObjek = res.data.total_aset;
                dashboard.value.pertumbuhan = res.data.percentage_increase;
            } catch (e) {
                dashboard.value.totalObjek = 211;
                dashboard.value.pertumbuhan = 8.1;
            }
        };

        const fetchAset = async () => {
            loading.value = true;
            try {
                if (!instansiId.value) {
                    dashboard.value.aset = [];
                    return;
                }
                const res = await getAllAsetByInstansi(instansiId.value);
                dashboard.value.aset = (res.data.data || []).map(aset => ({
                    id: aset.id,
                    nama: aset.nama,
                    jenis: aset.jenis?.nama || "-",
                    pemilik: aset.warga?.nama || "-",
                    lokasi: `RW ${aset.instansi?.rw || "-"} / RT ${aset.instansi?.rt || "-"}`,
                    alamat: aset.alamat,
                    foto: aset.fotos?.[0]?.url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                }));
            } catch (e) {
                dashboard.value.aset = [];
            } finally {
                loading.value = false;
                hasFetched.value = true;
            }
        };

        const fetchAsetByName = async (name) => {
            loading.value = true;
            try {
                if (!instansiId.value) {
                    dashboard.value.aset = [];
                    return;
                }
                const res = await searchAsetByName(name, instansiId.value);
                dashboard.value.aset = (res.data.data || []).map(aset => ({
                    id: aset.id,
                    nama: aset.nama,
                    jenis: aset.jenis?.nama || "-",
                    pemilik: aset.warga?.nama || "-",
                    lokasi: `RW ${aset.instansi?.rw || "-"} / RT ${aset.instansi?.rt || "-"}`,
                    alamat: aset.alamat,
                    foto: aset.fotos?.[0]?.url || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                }));
            } catch (e) {
                dashboard.value.aset = [];
            } finally {
                loading.value = false;
                hasFetched.value = true;
            }
        };

        onMounted(async () => {
            if (auth.user?.id) {
                const resWarga = await getWargaById(auth.user.id);
                const warga = resWarga.data.data;
                instansiId.value = warga?.instansi_id || null;
                await fetchDashboard();
                await fetchAset();
            }
        });

        watch(search, async (val) => {
            if (val && val.length > 0) {
                await fetchAsetByName(val);
            } else {
                await fetchAset();
            }
        });

        function goToAsetDetail(id) {
            router.push({ name: "aset-detail", params: { id } });
        }

        return {
            dashboard,
            search,
            loading,
            hasFetched,
            goToAsetDetail,
        };
    },
};
</script>