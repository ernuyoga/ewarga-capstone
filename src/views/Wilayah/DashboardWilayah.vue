<template>
    <div class="min-h-screen bg-[#f6f6f6]">
        <!-- Header -->
        <HeaderForm title="Pemetaan Wilayah" @back="goBack">
            <template #action>
                <button v-if="auth.user?.is_pengurus" @click="goToAsetAdd">
                    <img :src="tombolTambah" alt="Tambah" class="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
            </template>
        </HeaderForm>

        <!-- Container Responsive -->
        <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24">
            <!-- Statistik -->
            <div class="flex items-center justify-center bg-white rounded-xl shadow px-8 py-4 my-4 gap-8">
                <div class="flex-1 flex flex-col items-center">
                    <div class="text-xs lg:text-sm text-gray-500 mb-1">Total Objek:</div>
                    <div class="text-3xl lg:text-4xl font-bold">{{ dashboard.totalObjek }}</div>
                </div>
            </div>

            <!-- Search -->
            <div class="my-4">
                <div class="relative">
                    <input v-model="search" type="text" placeholder="Cari nama objek..."
                        class="w-full border rounded-lg px-6 py-3 text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] pr-12" />
                    <img src="@/assets/search_icon.svg" alt="Search"
                        class="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <!-- Skeleton Loader -->
            <template v-if="loading">
                <div v-for="n in 3" :key="n"
                    class="bg-white rounded-lg my-4 flex max-h-28 lg:max-h-32 overflow-hidden shadow-sm animate-pulse">
                    <div class="w-28 lg:w-32 h-28 lg:h-32 bg-gray-200 rounded-l-lg"></div>
                    <div class="p-4 flex-1 min-w-0 flex flex-col justify-center">
                        <div class="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </template>

            <!-- List Aset -->
            <template v-else>
                <div v-for="aset in dashboard.aset" :key="aset.id"
                    class="bg-white rounded-lg my-4 max-h-28 lg:max-h-32 flex cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
                    @click="goToAsetDetail(aset.id)">
                    <img :src="aset.foto && aset.foto !== '' ? getImageUrl(aset.foto) : mapDefault"
                        class="w-28 lg:w-32 h-28 lg:h-32 object-cover rounded-l-lg" alt="Foto Aset" />
                    <div class="p-4 flex-1 min-w-0 flex flex-col justify-center">
                        <div class="font-semibold text-base lg:text-lg mb-1 truncate" :title="aset.nama">{{ aset.nama }}
                        </div>
                        <div class="text-xs lg:text-sm text-gray-500 mb-1">{{ aset.jenis }} | {{ aset.pemilik }}</div>
                        <div class="text-xs lg:text-sm text-gray-500 mb-1">{{ aset.lokasi }}</div>
                        <div class="text-xs lg:text-sm text-gray-400 truncate" :title="aset.alamat">{{ aset.alamat }}
                        </div>
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
import tombolTambah from '@/assets/tombol_tambah.svg';
import mapDefault from '@/assets/map.svg'; // Tambahkan ini
import { clearAsetFormData } from "@/services/asetservice";
import { clearUmkmFormData, clearEditUmkmFormData } from "@/services/umkmService";
import { clearProdukFormData, clearEditProdukFormData } from "@/services/produkService";
import { getImageUrl } from '@/lib/axios';

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
            foto: aset.fotos?.[0]?.file_path
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
            foto: aset.fotos?.[0]?.file_path
        }));
    } catch (e) {
        dashboard.value.aset = [];
    } finally {
        loading.value = false;
        hasFetched.value = true;
    }
};

onMounted(async () => {
    clearAsetFormData();
    clearUmkmFormData();
    clearEditUmkmFormData();
    clearProdukFormData();
    clearEditProdukFormData();
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

function goToAsetAdd() {
    clearAsetFormData();
    router.push({ name: "asetadd" });
}

function goBack() {
    router.push({ name: "home" });
}
</script>