<template>
    <div class="min-h-screen bg-[#f6f6f6]">
        <!-- Header -->
        <HeaderForm title="Dashboard UMKM" @back="goToHomePage">
            <template #action>
                <button @click="handleAdd">
                    <img :src="tombolTambah" alt="Tambah" class="w-6 h-6" />
                </button>
            </template>
        </HeaderForm>

        <!-- Container Responsive -->
        <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24">
            <!-- Statistik -->
            <div class="flex items-start justify-center bg-white rounded-xl shadow px-8 py-4 my-4">
                <div class="flex flex-col items-start justify-center mr-8">
                    <div class="text-xs lg:text-sm text-gray-500 mb-1">Total UMKM:</div>
                    <div class="text-3xl lg:text-4xl font-bold">{{ totalUmkm }}</div>
                </div>
                <div class="flex flex-col items-end justify-center">
                    <div class="text-xs lg:text-sm text-gray-500 mb-1">Total Produk:</div>
                    <div class="text-3xl lg:text-4xl font-bold">{{ totalProduk }}</div>
                </div>
            </div>

            <!-- Search & Filter -->
            <div class="my-4">
                <div class="flex flex-col gap-2">
                    <input type="text" placeholder="Cari nama umkm..."
                        class="w-full border rounded-lg px-6 py-3 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#00c48c]"
                        v-model="search" @input="fetchUmkm" />
                    <div class="flex gap-2">
                        <select
                            class="flex-1 px-2 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#00c48c]"
                            v-model="selectedJenis">
                            <option value="">Moda Usaha</option>
                            <option v-for="j in jenisList" :key="j.id" :value="j.id">{{ j.nama }}</option>
                        </select>
                        <select
                            class="flex-1 px-2 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#00c48c]"
                            v-model="selectedBentuk">
                            <option value="">Bentuk Usaha</option>
                            <option v-for="b in bentukList" :key="b.id" :value="b.id">{{ b.nama }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Skeleton Loader -->
            <template v-if="loading">
                <div v-for="n in 3" :key="n" class="bg-white rounded-lg shadow my-4 flex animate-pulse">
                    <div class="w-28 lg:w-32 bg-gray-200 rounded-l-lg"></div>
                    <div class="p-4 flex-1">
                        <div class="h-5 lg:h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div class="h-3 lg:h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div class="h-3 lg:h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
            </template>

            <!-- Daftar UMKM -->
            <template v-else>
                <div v-for="umkm in umkmList" :key="umkm.id"
                    class="bg-white rounded-lg my-4 flex cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
                    @click="goToUmkmDetail(umkm.id)">
                    <img :src="umkm.image || defaultImage"
                        class="w-28 lg:w-32 h-28 lg:h-32 object-cover rounded-l-lg" />
                    <div class="p-4 flex-1 flex flex-col justify-center">
                        <div class="font-semibold text-base lg:text-lg mb-1">{{ umkm.nama }}</div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="inline-block w-3 h-3 rounded-full"
                                :class="umkm.jenis === 1 ? 'bg-green-400' : 'bg-gray-400'"></span>
                            <span class="text-xs lg:text-sm font-semibold"
                                :class="umkm.jenis === 1 ? 'text-green-500' : 'text-gray-500'">
                                {{ umkm.jenis === 1 ? 'Usaha Offline' : 'Usaha Online' }}
                            </span>
                        </div>
                        <div class="text-xs lg:text-sm text-gray-600 leading-tight">{{ umkm.alamat || '-' }}</div>
                    </div>
                </div>
                <div v-if="!loading && hasFetched && umkmList.length === 0"
                    class="text-center text-gray-500 mt-6 text-sm lg:text-base">
                    Data UMKM tidak ditemukan.
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getAllUmkm, getUmkmDashboard } from "@/services/umkmService";
import { getWargaById } from "@/services/wargaService";
import { getUmkmMaster } from "@/services/masterService";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import tombolTambah from '@/assets/tombol_tambah.png';
import HeaderForm from '@/components/card/HeaderForm.vue';

const router = useRouter();
const auth = useAuthStore();
const warga = ref(null);
const umkmList = ref([]);
const totalUmkm = ref(0);
const totalProduk = ref(0);
const loading = ref(false);
const hasFetched = ref(false); // Tambahan untuk UX pesan kosong
const search = ref("");
const defaultImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";
const instansiId = ref(null);

const jenisList = ref([]);
const bentukList = ref([]);
const selectedJenis = ref("");
const selectedBentuk = ref("");

async function fetchMaster() {
    try {
        const { data } = await getUmkmMaster();
        if (data && data.data) {
            jenisList.value = data.data.jenis || [];
            bentukList.value = data.data.bentuk || [];
        }
    } catch (e) {
        jenisList.value = [];
        bentukList.value = [];
    }
}

async function fetchSummary() {
    if (!instansiId.value) return;
    try {
        const { data } = await getUmkmDashboard({ instansi_id: instansiId.value });
        if (data && data.data) {
            totalUmkm.value = data.data.total_umkm || 0;
            totalProduk.value = data.data.total_produk || 0;
        }
    } catch (e) {
        totalUmkm.value = 0;
        totalProduk.value = 0;
    }
}

async function fetchUmkm() {
    loading.value = true;
    try {
        if (!instansiId.value) {
            umkmList.value = [];
            return;
        }
        const params = { instansi_id: instansiId.value };
        if (search.value) params.nama = search.value;
        if (selectedJenis.value) params.jenis = selectedJenis.value;
        if (selectedBentuk.value) params.bentuk = selectedBentuk.value;
        const { data } = await getAllUmkm(params);
        umkmList.value = Array.isArray(data.data) ? data.data : [];
    } catch (e) {
        umkmList.value = [];
    } finally {
        loading.value = false;
        hasFetched.value = true;
    }
}

onMounted(async () => {
    if (auth.user?.id) {
        const resWarga = await getWargaById(auth.user.id);
        warga.value = resWarga.data.data;
        instansiId.value = warga.value?.instansi_id || null;
        await fetchMaster();
        await fetchSummary();
        await fetchUmkm();
    }
});

function goToHomePage() {
    router.push({ name: "home" });
}

function goToUmkmDetail(id) {
    router.push({ name: "umkm-detail", params: { id } });
}

watch([selectedJenis, selectedBentuk], fetchUmkm);

function goBack() {
    router.back()
}

function handleAdd() {
    router.push({ name: "addumkm" });
}
</script>