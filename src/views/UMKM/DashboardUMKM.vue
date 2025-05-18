<template>
    <div class="max-w-[400px] mx-auto font-inter bg-white min-h-screen">
        <header class="flex items-center justify-between px-3 pt-4 pb-2 border-b border-gray-200">
            <h2 class="text-lg font-semibold m-0">Kelola UMKM</h2>
        </header>
        <section class="flex gap-3 px-3 pt-4">
            <div class="flex-1 bg-gray-100 rounded-lg p-3 text-left">
                <div class="text-xs text-gray-500">Total UMKM</div>
                <div class="text-xl font-bold my-1">{{ totalUmkm }}</div>
            </div>
            <div class="flex-1 bg-gray-100 rounded-lg p-3 text-left">
                <div class="text-xs text-gray-500">Total Produk</div>
                <div class="text-xl font-bold my-1">{{ totalProduk }}</div>
            </div>
        </section>
        <section class="flex flex-col gap-2 px-3 pt-4">
            <input type="text" placeholder="Cari nama umkm..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" v-model="search"
                @input="fetchUmkm" />
            <div class="flex gap-2">
                <select class="flex-1 px-2 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700"
                    v-model="selectedJenis">
                    <option value="">Moda Usaha</option>
                    <option v-for="j in jenisList" :key="j.id" :value="j.id">{{ j.nama }}</option>
                </select>
                <select class="flex-1 px-2 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700"
                    v-model="selectedBentuk">
                    <option value="">Bentuk Usaha</option>
                    <option v-for="b in bentukList" :key="b.id" :value="b.id">{{ b.nama }}</option>
                </select>
            </div>
        </section>
        <section class="px-3 pt-4 pb-8">
            <div v-for="umkm in umkmList" :key="umkm.id"
                class="flex bg-gray-100 rounded-xl mb-3 overflow-hidden shadow-sm">
                <img :src="umkm.image || defaultImage" class="w-[90px] h-[90px] object-cover rounded-l-lg" />
                <div class="flex-1 p-3 flex flex-col justify-center">
                    <div class="text-base font-semibold mb-0.5">{{ umkm.nama }}</div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="inline-block w-3 h-3 rounded-full"
                            :class="umkm.jenis === 1 ? 'bg-green-400' : 'bg-gray-400'"></span>
                        <span class="text-xs font-semibold"
                            :class="umkm.jenis === 1 ? 'text-green-500' : 'text-gray-500'">
                            {{ umkm.jenis === 1 ? 'Usaha Offline' : 'Usaha Online' }}
                        </span>
                    </div>
                    <div class="text-xs text-gray-600 leading-tight">{{ umkm.alamat || '-' }}</div>
                </div>
            </div>
            <div v-if="loading" class="text-center text-gray-500 mt-6">Memuat data...</div>
            <div v-if="!loading && umkmList.length === 0" class="text-center text-gray-500 mt-6">Data UMKM tidak
                ditemukan.</div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { getAllUmkm, getUmkmDashboard } from "@/services/umkmService";
import { getWargaById } from "@/services/wargaService";
import { getUmkmMaster } from "@/services/masterService";
import { useAuthStore } from "@/store/auth";

const auth = useAuthStore();
const warga = ref(null);
const umkmList = ref([]);
const totalUmkm = ref(0);
const totalProduk = ref(0);
const loading = ref(false);
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
    if (!instansiId.value) return;
    loading.value = true;
    try {
        const params = { instansi_id: instansiId.value };
        if (search.value) params.nama = search.value;
        if (selectedJenis.value) params.jenis = selectedJenis.value;
        if (selectedBentuk.value) params.bentuk = selectedBentuk.value;
        const { data } = await getAllUmkm(params);
        umkmList.value = Array.isArray(data.data) ? data.data : [];
    } catch (e) {
        umkmList.value = [];
    }
    loading.value = false;
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

watch([selectedJenis, selectedBentuk], fetchUmkm);
</script>