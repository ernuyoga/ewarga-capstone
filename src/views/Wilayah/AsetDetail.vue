<template>
    <div class="min-h-screen bg-[#f6f6f6]">
        <!-- Header -->
        <HeaderForm title="Detail Objek Wilayah" @back="goBack">
            <template #action>
                <button>
                    <!-- <img :src="tombolTitikTiga" alt="Titik Tiga" class="w-8 h-8" /> -->
                </button>
            </template>
        </HeaderForm>

        <div class="bg-white rounded-xl shadow mx-24 my-4">
            <!-- Foto -->
            <img :src="fotoUtama" class="w-full h-72 rounded-t-xl object-cover" />

            <div class="px-6 py-6">
                <!-- Informasi Aset -->
                <section class="px-2 py-2">
                    <div class="text-xl font-bold mb-2">{{ aset.nama }}</div>
                    <div class="text-base text-gray-600 font-semibold mb-2">
                        {{ aset.jenis?.nama || '-' }} | {{ aset.warga?.nama || '-' }}
                    </div>
                    <div class="text-base text-gray-500 truncate">{{ aset.alamat || '-' }}</div>
                </section>

                <!-- Garis pemisah -->
                <div class="border-t border-gray-200 mt-4 mb-8"></div>

                <div class="flex flex-col md:flex-row gap-10">
                    <div class="flex-1">
                        <!-- Koordinat -->
                        <section class="px-2 mb-4">
                            <div class="font-bold text-lg mb-2">Koordinat Objek</div>
                            <div class="rounded-lg overflow-hidden mb-2">
                                <div id="map" class="w-full h-64"></div>
                            </div>
                            <div class="text-base text-gray-500">
                                {{ aset.latitude }}, {{ aset.longitude }}
                            </div>
                        </section>
                    </div>
                    <div class="flex-1">
                        <!-- Penghuni -->
                        <section class="px-2 mb-8">
                            <div class="flex items-center justify-between mb-3">
                                <div class="font-bold text-lg">Penghuni Objek</div>
                                <button
                                    class="bg-green-100 text-green-500 text-sm font-bold px-2 py-1 rounded-lg hover:bg-green-200"
                                    @click="lihatSemuaPenghuni">Lihat Semua</button>
                            </div>
                            <div v-if="penghuniList.length === 0" class="text-base text-gray-400">Tidak ada penghuni.
                            </div>
                            <div v-for="(penghuni, index) in penghuniList.slice(0, 3)" :key="index"
                                class="flex items-center gap-4 mb-3 bg-[#ffffff] border rounded-lg px-4 py-3">
                                <!-- <img :src="penghuni.foto_path ? `${import.meta.env.VITE_API_BASE_URL || ''}/${penghuni.foto_path}` : fotoDefault"
                                    class="w-12 h-12 rounded-full object-cover" /> -->
                                <div class="text-base">
                                    <div class="font-semibold text-lg">{{ penghuni.nama }}</div>
                                    <div class="text-gray-500">{{ penghuni.status }}</div>
                                    <div class="text-blue-600">{{ penghuni.no_tlp || '—' }}</div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAsetById } from '@/services/wilayahService';
import { getPenghuniByAset } from '@/services/penghuniService'; // Import service penghuni
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import HeaderForm from '@/components/card/HeaderForm.vue';

const route = useRoute();
const router = useRouter();
const aset = ref({});
const penghuniList = ref([]);
const fotoDefault = 'https://randomuser.me/api/portraits/men/32.jpg';

const fotoUtama = computed(() => {
    if (aset.value.fotos && aset.value.fotos.length > 0) {
        return `${import.meta.env.VITE_API_BASE_URL || ''}/${aset.value.fotos[0].file_path}`;
    }
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80';
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
