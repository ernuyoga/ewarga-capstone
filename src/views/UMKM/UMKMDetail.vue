<template>
    <div class="max-w-[400px] mx-auto font-inter bg-white min-h-screen">
        <!-- Header -->
        <header class="flex items-center justify-between px-3 pt-4 pb-2 border-b border-gray-200">
            <button @click="goBack" class="text-gray-500 mr-2">
                <i class="icon-arrow-left"></i>
            </button>
            <h2 class="text-lg font-semibold flex-1 text-center">Detail Usaha</h2>
            <button class="ml-2 text-gray-500"><i class="icon-more"></i></button>
        </header>

        <!-- Foto UMKM -->
        <img :src="fotoUtama" class="w-full h-44 object-cover" />

        <!-- Info UMKM -->
        <section class="px-4 py-3">
            <div class="text-xl font-bold mb-1">{{ umkm.nama }}</div>
            <div class="flex items-center gap-2 text-sm mb-1">
                <span class="inline-block w-3 h-3 rounded-full"
                    :class="umkm.jenis?.nama === 'Offline' ? 'bg-green-400' : 'bg-gray-400'"></span>
                <span class="font-semibold"
                    :class="umkm.jenis?.nama === 'Offline' ? 'text-green-500' : 'text-gray-500'">
                    {{ umkm.jenis?.nama ? 'Usaha ' + umkm.jenis.nama : '-' }}
                </span>
                <span class="mx-1 text-gray-400">|</span>
                <span class="text-gray-600">{{ umkm.bentuk?.nama || '-' }}</span>
            </div>
            <div class="text-gray-500 text-sm mb-2 truncate">{{ umkm.alamat || '-' }}</div>
        </section>

        <!-- Kontak Usaha -->
        <section class="px-4 mb-3">
            <div class="font-semibold mb-1">Kontak Usaha</div>
            <ul class="text-sm text-gray-700">
                <li v-for="kontak in umkm.kontaks" :key="kontak.id">
                    • {{ kontak.jenis_kontak }}: {{ kontak.kontak }}
                </li>
                <li v-if="!umkm.kontaks || umkm.kontaks.length === 0" class="text-gray-400">Tidak ada kontak.</li>
            </ul>
        </section>

        <!-- Koordinat Objek -->
        <section class="px-4 mb-3">
            <div class="font-semibold mb-1">Koordinat Objek</div>
            <div class="rounded-lg overflow-hidden mb-1">
                <div id="map" class="w-full h-32" style="height: 130px;"></div>
            </div>
            <div class="text-xs text-gray-500">
                {{ umkm.lokasi_point?.latitude }}, {{ umkm.lokasi_point?.longitude }}
            </div>
        </section>

        <!-- Produk -->
        <section class="px-4 mb-4">
            <div class="flex items-center justify-between mb-2">
                <div class="font-semibold">Produk</div>
                <button @click="goToAddProduk" class="p-1">
                    <img :src="tombolTambah" alt="Tambah Produk" class="w-6 h-6" />
                </button>
            </div>
            <div class="relative mb-2">
                <input v-model="searchProduk" type="text" placeholder="Cari nama produk..."
                    class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm w-full" />
                <i class="icon-search absolute right-2 top-2 text-gray-400"></i>
            </div>
            <div v-if="filteredProduk.length === 0" class="text-gray-400 text-sm text-center py-4">
                Tidak ada produk.
            </div>
            <div v-for="produk in filteredProduk" :key="produk.id"
                class="flex items-center gap-3 bg-gray-50 rounded-xl mb-2 p-3 cursor-pointer hover:bg-gray-100 transition"
                @click="goToProdukDetail(produk.id)">
                <img :src="defaultImage" class="w-16 h-16 object-cover rounded-lg" />
                <div class="flex-1">
                    <div class="font-semibold text-base">{{ produk.nama }}</div>
                    <div class="text-xs text-gray-500 mb-1">{{ produk.keterangan }}</div>
                    <div class="text-green-600 font-bold text-lg">Rp{{ produk.harga?.toLocaleString() }}</div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getUmkmById } from "@/services/umkmService";
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import tombolTambah from '@/assets/tombol_tambah.png';
import { setProdukFormData } from "@/services/produkService";

const route = useRoute();
const router = useRouter();
const umkm = ref({});
const produkList = ref([]);
const loading = ref(true);
const searchProduk = ref("");
const defaultImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";

const fotoUtama = computed(() => {
    if (umkm.value.fotos && umkm.value.fotos.length > 0) {
        // Ganti dengan base url file jika ada
        return `${import.meta.env.VITE_API_BASE_URL || ''}/${umkm.value.fotos[0].file_path}`;
    }
    return defaultImage;
});

const isEmpty = computed(() => !umkm.value || Object.keys(umkm.value).length === 0);

const filteredProduk = computed(() => {
    if (!searchProduk.value) return produkList.value;
    return produkList.value.filter(p =>
        p.nama?.toLowerCase().includes(searchProduk.value.toLowerCase())
    );
});

function goBack() {
    router.back();
}

onMounted(async () => {
    const id = route.params.id;
    if (!id) return;
    loading.value = true;
    try {
        const { data } = await getUmkmById(id);
        if (data && data.data) {
            umkm.value = data.data;
            produkList.value = data.data.produks || [];
        }
    } catch (e) {
        umkm.value = {};
        produkList.value = [];
    }
    loading.value = false;
});

function showMap() {
    if (!umkm.value.lokasi_point?.latitude || !umkm.value.lokasi_point?.longitude) return;
    if (window._umkmMap) {
        window._umkmMap.remove();
        window._umkmMap = null;
    }
    const map = L.map('map').setView([
        umkm.value.lokasi_point.latitude,
        umkm.value.lokasi_point.longitude
    ], 16);
    window._umkmMap = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.marker([
        umkm.value.lokasi_point.latitude,
        umkm.value.lokasi_point.longitude
    ]).addTo(map);
}

watch(umkm, (val) => {
    if (val.lokasi_point?.latitude && val.lokasi_point?.longitude) {
        setTimeout(showMap, 200);
    }
});

function goToProdukDetail(id) {
    router.push({ name: 'produk-detail', params: { id } });
}

function goToAddProduk() {
    setProdukFormData({ umkm_id: umkm.value.id });
    router.push({ name: 'addproduk' });
}
</script>