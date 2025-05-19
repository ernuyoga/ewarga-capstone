<template>
    <div class="max-w-[400px] mx-auto font-inter bg-white min-h-screen">
        <!-- Header -->
        <header class="flex items-center justify-between px-3 pt-4 pb-2 border-b border-gray-200">
            <button @click="goBack" class="text-gray-500 mr-2">
                <i class="icon-arrow-left"></i>
            </button>
            <h2 class="text-lg font-semibold flex-1 text-center">Detail Objek Wilayah</h2>
            <button class="ml-2 text-gray-500">
                <i class="icon-more"></i>
            </button>
        </header>

        <!-- Foto -->
        <img :src="fotoUtama" class="w-full h-44 object-cover" />

        <!-- Informasi Aset -->
        <section class="px-4 py-3">
            <div class="text-xl font-bold mb-1">{{ aset.nama }}</div>
            <div class="text-sm text-gray-600 font-medium mb-1">
                {{ aset.jenis?.nama || '-' }} | {{ aset.warga?.nama || '-' }}
            </div>
            <div class="text-gray-500 text-sm truncate">{{ aset.alamat || '-' }}</div>
        </section>

        <!-- Koordinat -->
        <section class="px-4 mb-3">
            <div class="font-semibold mb-1">Koordinat Objek</div>
            <div class="rounded-lg overflow-hidden mb-1">
                <div id="map" class="w-full h-32" style="height: 130px;"></div>
            </div>
            <div class="text-xs text-gray-500">
                {{ aset.latitude }}, {{ aset.longitude }}
            </div>
        </section>

        <!-- Penghuni -->
        <section class="px-4 mb-6">
            <div class="flex items-center justify-between mb-2">
                <div class="font-semibold">Penghuni Objek</div>
                <button class="text-green-600 text-sm" @click="lihatSemuaPenghuni">Lihat Semua</button>
            </div>
            <div v-if="penghuniList.length === 0" class="text-sm text-gray-400">Tidak ada penghuni.</div>
            <div v-for="(penghuni, index) in penghuniList.slice(0, 3)" :key="index"
                class="flex items-center gap-3 mb-2">
                <!-- <img :src="penghuni.foto_path ? `${import.meta.env.VITE_API_BASE_URL || ''}/${penghuni.foto_path}` : fotoDefault"
            class="w-10 h-10 rounded-full object-cover" /> -->
                <div class="text-sm">
                    <div class="font-semibold">{{ penghuni.nama }}</div>
                    <div class="text-gray-500">{{ penghuni.status }}</div>
                    <div class="text-blue-600">{{ penghuni.no_tlp || '—' }}</div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAsetById } from '@/services/wilayahService';
import { getPenghuniByAset } from '@/services/penghuniService'; // Import service penghuni
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const route = useRoute();
const router = useRouter();
const aset = ref({});
const penghuniList = ref([]);
const fotoDefault = 'https://randomuser.me/api/portraits/men/32.jpg';

const fotoUtama = computed(() => {
    if (aset.value.fotos && aset.value.fotos.length > 0) {
        return `${import.meta.env.VITE_API_BASE_URL || ''}/${aset.value.fotos[0].file_path}`;
    }
    return 'https://source.unsplash.com/400x200/?house';
});

function goBack() {
    router.back();
}

function showMap() {
    if (!aset.value.latitude || !aset.value.longitude) return;
    if (window._asetMap) {
        window._asetMap.remove();
        window._asetMap = null;
    }

    const map = L.map('map').setView([aset.value.latitude, aset.value.longitude], 16);
    window._asetMap = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    L.marker([aset.value.latitude, aset.value.longitude]).addTo(map);
}

onMounted(async () => {
    const id = route.params.id;
    if (!id) return;
    try {
        // Ambil detail aset
        const { data } = await getAsetById(id);
        if (data && data.data) {
            aset.value = data.data;
        }
        // Ambil penghuni aset
        const penghuniRes = await getPenghuniByAset(id);
        if (penghuniRes && penghuniRes.data) {
            // Set penghuniList dengan data warga dan status
            penghuniList.value = penghuniRes.data.map(item => ({
                ...item.warga,
                status: item.status?.nama || '-'
            }));
        }
    } catch (error) {
        console.error(error);
    }

    setTimeout(showMap, 300);
});

function lihatSemuaPenghuni() {
    router.push({ name: 'penghuni-detail', params: { id: route.params.id } });
}
</script>
