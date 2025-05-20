<template>
    <div class="min-h-screen bg-[#f6f6f6]">
        <!-- Header -->
        <HeaderForm title="Pemetaan Wilayah" @back="goBack">
            <template #action>
                <button>
                    <img :src="tombolTambah" alt="Tambah" class="w-6 h-6" />
                </button>
            </template>
        </HeaderForm>

        <!-- Container Responsive -->
        <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24">
            <!-- Statistik -->
            <div class="flex items-start justify-center bg-white rounded-xl shadow px-8 py-4 my-4">
                <div class="flex flex-col items-start justify-center mr-8">
                    <div class="text-xs lg:text-sm text-gray-500 mb-1">Total Objek:</div>
                    <div class="text-3xl lg:text-4xl font-bold">{{ dashboard.totalObjek }}</div>
                </div>
                <div class="text-right">
                    <div class="text-xs lg:text-sm text-gray-500 mb-1">Pertumbuhan sepanjang tahun</div>
                    <div class="flex items-center justify-end">
                        <svg class="w-4 lg:w-5 h-4 lg:h-5 text-green-500" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        <span class="text-green-500 font-semibold text-3xl lg:text-4xl mr-1">{{ dashboard.pertumbuhan
                            }}%</span>
                    </div>
                </div>
            </div>

            <!-- Search -->
            <div class="my-4">
                <input v-model="search" type="text" placeholder="Cari nama objek..."
                    class="w-full border rounded-lg px-6 py-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-gray-100" />
            </div>

            <!-- Skeleton Loader -->
            <template v-if="loading">
                <div v-for="n in 3" :key="n" class="bg-white rounded-lg shadow my-4 flex animate-pulse">
                    <div class="w-28 lg:w-32 bg-gray-200 rounded-l-lg"></div>
                    <div class="p-4 flex-1">
                        <div class="h-5 lg:h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div class="h-3 lg:h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div class="h-3 lg:h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div class="h-3 lg:h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </template>

            <!-- List Aset -->
            <template v-else>
                <div v-for="aset in dashboard.aset" :key="aset.id" class="bg-white rounded-lg shadow my-4 flex"
                    @click="goToAsetDetail(aset.id)" style="cursor:pointer">
                    <img :src="aset.foto" alt="foto aset" class="w-28 lg:w-32 object-cover rounded-l-lg" />
                    <div class="p-4 flex-1">
                        <div class="font-semibold text-base lg:text-lg">{{ aset.nama }}</div>
                        <div class="text-xs lg:text-sm text-gray-500 mb-1">{{ aset.jenis }} | {{ aset.pemilik }}</div>
                        <div class="text-xs lg:text-sm text-gray-500 mb-1">{{ aset.lokasi }}</div>
                        <div class="text-xs lg:text-sm text-gray-400">{{ aset.alamat }}</div>
                    </div>
                </div>
                <div v-if="!loading && hasFetched && dashboard.aset.length === 0"
                    class="text-center text-gray-500 mt-6 text-sm lg:text-base">
                    Data aset tidak ditemukan.
                </div>
            </template>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { getWilayahDashboard, getAllAsetByInstansi, searchAsetByName } from "@/services/wilayahService";
import { getWargaById } from "@/services/wargaService";
import { useAuthStore } from "@/store/auth";
import HeaderForm from '@/components/card/HeaderForm.vue';
import tombolTambah from '@/assets/tombol_tambah.png';

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

function goBack() {
    router.back();
}
</script>