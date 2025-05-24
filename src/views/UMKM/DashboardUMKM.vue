<template>
    <div class="min-h-screen bg-[#f6f6f6]">
        <!-- Header -->
        <HeaderForm title="Dashboard UMKM" @back="goToHomePage">
            <template #action>
                <button v-if="auth.user?.is_pengurus" @click="handleAdd">
                    <img :src="tombolTambah" alt="Tambah" class="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
            </template>
        </HeaderForm>

        <!-- Container Responsive -->
        <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24">
            <!-- Statistik -->
            <div class="flex items-center justify-center bg-white rounded-xl shadow px-8 py-4 my-4 gap-16">
                <div class="flex-1 flex flex-col items-center">
                    <div class="text-xs lg:text-sm text-gray-500 mb-1">Total UMKM:</div>
                    <div class="text-3xl lg:text-4xl font-bold">{{ totalUmkm }}</div>
                </div>
                <div class="h-12 w-px bg-gray-200"></div>
                <div class="flex-1 flex flex-col items-center">
                    <div class="text-xs lg:text-sm text-gray-500 mb-1">Total Produk:</div>
                    <div class="text-3xl lg:text-4xl font-bold">{{ totalProduk }}</div>
                </div>
            </div>

            <!-- Search & Filter -->
            <div class="my-4">
                <div class="flex flex-col gap-3">
                    <div class="relative">
                        <input type="text" placeholder="Cari nama UMKM..."
                            class="w-full border rounded-lg px-6 py-3 text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] pr-12"
                            v-model="search" @input="fetchUmkm" />
                        <img src="@/assets/search_icon.svg" alt="Search"
                            class="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400 pointer-events-none" />
                    </div>
                    <div class="flex gap-2 items-center">
                        <button @click="selectedJenis = ''; selectedBentuk = ''; fetchUmkm()"
                            class="p-2 mr-1 lg:mr-2 rounded-full bg-white hover:shadow transition" title="Reset Filter"
                            type="button">
                            <img src="@/assets/x_icon.svg" alt="Reset" class="w-4 h-4" />
                        </button>
                        <div class="relative flex-1">
                            <select
                                class="w-full px-2 py-2 pl-4 border border-[#03BF8C] rounded-full bg-gray-50 text-sm text-[#03BF8C] appearance-none focus:outline-none focus:ring-1 focus:ring-[#03BF8C]"
                                v-model="selectedJenis">
                                <option value="" class="text-gray-500">Moda Usaha</option>
                                <option v-for="j in jenisList" :key="j.id" :value="j.id" class="text-gray-800">{{ j.nama
                                }}
                                </option>
                            </select>
                            <img src="@/assets/v_hijau.svg" alt="Dropdown"
                                class="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 lg:w-4 lg:h-4" />
                        </div>
                        <div class="relative flex-1">
                            <select
                                class="w-full px-2 py-2 pl-4 border border-[#03BF8C] rounded-full bg-gray-50 text-sm text-[#03BF8C] appearance-none focus:outline-none focus:ring-1 focus:ring-[#03BF8C]"
                                v-model="selectedBentuk">
                                <option value="" class="text-gray-500">Bentuk Usaha</option>
                                <option v-for="b in bentukList" :key="b.id" :value="b.id" class="text-gray-800">{{
                                    b.nama }}
                                </option>
                            </select>
                            <img src="@/assets/v_hijau.svg" alt="Dropdown"
                                class="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 lg:w-4 lg:h-4" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Skeleton Loader -->
            <template v-if="loading">
                <div v-for="n in 3" :key="n" class="bg-white rounded-lg shadow my-4 flex animate-pulse overflow-hidden">
                    <div class="w-28 lg:w-32 h-28 lg:h-32 bg-gray-200 rounded-l-lg"></div>
                    <div class="p-4 flex-1 flex flex-col justify-center">
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
                    <img :src="getImageUrl(umkm.fotos && umkm.fotos.length > 0 ? umkm.fotos[0].file_path : null)"
                        class="w-28 lg:w-32 h-28 lg:h-32 object-cover rounded-l-lg" alt="Foto UMKM" />
                    <div class="p-4 flex-1 flex flex-col justify-center">
                        <div class="font-semibold text-base lg:text-lg mb-1">{{ umkm.nama }}</div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="inline-block w-3 h-3 rounded-full"
                                :class="umkm.jenis?.id === 2 ? 'bg-gray-400' : 'bg-green-400'"></span>
                            <span class="text-xs lg:text-sm font-semibold"
                                :class="umkm.jenis?.id === 2 ? 'text-gray-500' : 'text-green-500'">
                                {{ umkm.jenis?.nama || '-' }}
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
import tombolTambah from '@/assets/tombol_tambah.svg';
import HeaderForm from '@/components/card/HeaderForm.vue';
import { getImageUrl } from '@/lib/axios';
import { clearAsetFormData, clearAsetEditFormData,  } from "@/services/asetservice";
import { clearUmkmFormData, clearEditUmkmFormData } from "@/services/umkmService";
import { clearProdukFormData, clearEditProdukFormData } from "@/services/produkService";
import {clearAsetPenghuniData} from "@/services/penghuniService";

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
    clearAsetFormData();
    clearAsetEditFormData();
    clearUmkmFormData();
    clearEditUmkmFormData();
    clearProdukFormData();
    clearEditProdukFormData();
    clearAsetPenghuniData();
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