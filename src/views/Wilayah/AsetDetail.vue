<template>
    <div class="min-h-screen bg-[#f6f6f6]">
        <!-- Header -->
        <HeaderForm title="Detail Objek Wilayah" @back="goBack">
            <template #action>
                <div class="relative">
                    <button @click="toggleMenu">
                        <img :src="tombolTitikTiga" alt="Titik Tiga" class="w-6 h-6" />
                    </button>
                    <!-- Popup Menu -->
                    <div v-if="showMenu" ref="menuRef"
                        class="absolute right-0 mt-2 z-50 bg-white rounded-xl shadow-lg py-2 w-48" @mousedown.stop>
                        <button
                            class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-[#00c48c] font-semibold"
                            @click="handleUbah">
                            <span class="material-icons text-base">edit</span> Ubah
                        </button>
                        <button
                            class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-[#4f4f8f] font-semibold"
                            @click="handleAturKoordinat">
                            <span class="material-icons text-base">my_location</span> Atur Koordinat
                        </button>
                        <button
                            class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-[#4f4f8f] font-semibold"
                            @click="handleAturPenghuni">
                            <span class="material-icons text-base">groups</span> Atur Penghuni
                        </button>
                        <button
                            class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-[#ff4d4f] font-semibold"
                            @click="handleHapus">
                            <span class="material-icons text-base">delete</span> Hapus
                        </button>
                    </div>
                </div>
            </template>
        </HeaderForm>

        <!-- Container Responsive -->
        <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24">
            <!-- Skeleton Loader -->
            <div v-if="loading" class="bg-white rounded-xl shadow my-4 animate-pulse">
                <div class="w-full h-56 lg:h-72 bg-gray-200 rounded-t-xl"></div>
                <div class="px-4 lg:px-6 py-4 lg:py-6">
                    <div class="h-6 lg:h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div class="h-5 lg:h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                    <div class="h-4 lg:h-5 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div class="border-t border-gray-200 mt-4 mb-8"></div>
                    <div class="flex flex-col md:flex-row gap-6 lg:gap-10">
                        <div class="flex-1">
                            <div class="h-5 lg:h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div class="w-full h-40 lg:h-64 bg-gray-200 rounded-lg mb-2"></div>
                            <div class="h-4 lg:h-5 bg-gray-200 rounded w-1/4"></div>
                        </div>
                        <div class="flex-1">
                            <div class="h-5 lg:h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div class="space-y-4">
                                <div class="flex items-center gap-4 mb-3">
                                    <div class="w-10 lg:w-12 h-10 lg:h-12 bg-gray-200 rounded-full"></div>
                                    <div class="flex-1">
                                        <div class="h-4 lg:h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                                        <div class="h-3 lg:h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                                        <div class="h-3 lg:h-4 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4 mb-3">
                                    <div class="w-10 lg:w-12 h-10 lg:h-12 bg-gray-200 rounded-full"></div>
                                    <div class="flex-1">
                                        <div class="h-4 lg:h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                                        <div class="h-3 lg:h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                                        <div class="h-3 lg:h-4 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div v-else class="bg-white rounded-xl shadow my-4">
                <!-- Foto -->
                <img :src="fotoUtama" class="w-full h-56 lg:h-72 rounded-t-xl object-cover" />

                <div class="px-4 lg:px-6 py-4 lg:py-6">
                    <!-- Informasi Aset -->
                    <section class="px-1 lg:px-2 py-1 lg:py-2">
                        <div class="text-lg lg:text-xl font-bold mb-2">{{ aset.nama }}</div>
                        <div class="text-sm lg:text-base text-gray-600 font-semibold mb-2">
                            {{ aset.jenis?.nama || '-' }} | {{ aset.warga?.nama || '-' }}
                        </div>
                        <div class="text-sm lg:text-base text-gray-500 truncate">{{ aset.alamat || '-' }}</div>
                    </section>

                    <!-- Garis pemisah -->
                    <div class="border-t border-gray-200 mt-4 mb-8"></div>

                    <div class="flex flex-col md:flex-row gap-6 lg:gap-10">
                        <div class="flex-1">
                            <!-- Koordinat -->
                            <section class="px-1 lg:px-2 mb-4">
                                <div class="font-bold text-base lg:text-lg mb-2">Koordinat Objek</div>
                                <div class="rounded-lg overflow-hidden mb-2">
                                    <div id="map" class="w-full h-40 lg:h-64"></div>
                                </div>
                                <div class="text-xs lg:text-sm text-gray-500">
                                    {{ aset.latitude }}, {{ aset.longitude }}
                                </div>
                            </section>
                        </div>
                        <div class="flex-1">
                            <!-- Penghuni -->
                            <section class="px-1 lg:px-2 mb-8">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="font-bold text-base lg:text-lg">Penghuni Objek</div>
                                    <button
                                        class="bg-green-100 text-green-500 text-xs lg:text-sm font-bold px-2 py-1 rounded-lg hover:bg-green-200"
                                        @click="lihatSemuaPenghuni">Lihat Semua</button>
                                </div>
                                <div v-if="penghuniList.length === 0" class="text-base lg:text-lg text-gray-400">Tidak
                                    ada
                                    penghuni.
                                </div>
                                <div v-for="(penghuni, index) in penghuniList.slice(0, 3)" :key="index"
                                    class="flex items-center gap-4 mb-3 bg-[#ffffff] border rounded-lg px-4 py-3">
                                    <!-- <img :src="penghuni.foto_path ? `${import.meta.env.VITE_API_BASE_URL || ''}/${penghuni.foto_path}` : fotoDefault"
                                    class="w-10 lg:w-12 h-10 lg:h-12 rounded-full object-cover" /> -->
                                    <div class="text-sm lg:text-base">
                                        <div class="font-semibold text-sm lg:text-base">{{ penghuni.nama }}</div>
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
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAsetById } from '@/services/wilayahService';
import { getPenghuniByAset, setAsetPenghuniData, clearAsetPenghuniData, deleteAset } from '@/services/penghuniService';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import HeaderForm from '@/components/card/HeaderForm.vue';
import tombolTitikTiga from '@/assets/titik_tiga.png';
import { setAsetEditFormData } from '@/services/asetservice'

const route = useRoute();
const router = useRouter();
const aset = ref({});
const penghuniList = ref([]);
const loading = ref(true);
const showMenu = ref(false);
const menuRef = ref(null);

function toggleMenu() {
    showMenu.value = !showMenu.value;
}

function handleClickOutside(event) {
    if (showMenu.value && menuRef.value && !menuRef.value.contains(event.target)) {
        showMenu.value = false;
    }
}

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
    document.addEventListener('mousedown', handleClickOutside);
    loading.value = true;
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
        if (penghuniRes && Array.isArray(penghuniRes.data)) {
            penghuniList.value = penghuniRes.data.map(item => ({
                ...item.warga,
                status: item.status?.nama || '-'
            }));
        } else {
            penghuniList.value = [];
        }
    } catch (error) {
        console.error(error);
    }
    loading.value = false;
    setTimeout(showMap, 300);
});

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});

function lihatSemuaPenghuni() {
    router.push({ name: 'penghuni-detail', params: { id: route.params.id } });
}

function handleUbah() {
    showMenu.value = false;
    let gambarArr = []
    if (Array.isArray(aset.value.fotos)) {
        gambarArr = aset.value.fotos.map((f, idx) => ({
            id: f.id,
            nama: f.nama,
            file_path: f.file_path,
            file: { name: f.nama || `Foto ${idx + 1}`, type: 'image/png' }
        }))
    }
    setAsetEditFormData({
        nama: aset.value.nama || "",
        jenis_id: aset.value.aset_m_jenis_id || "",
        alamat: aset.value.alamat || "",
        pemilik: aset.value.warga?.nama || "",
        pemilik_id: aset.value.warga_id || "",
        instansi_id: aset.value.instansi_id || "",
        fotos: gambarArr,
    })
    router.push({ name: 'asetedit', params: { id: aset.value.id } });
}

function handleAturKoordinat() {
    showMenu.value = false;
    router.push({ name: 'asetkoordinat', params: { id: aset.value.id } });
}

async function handleAturPenghuni() {
    showMenu.value = false;
    try {
        const penghuniRes = await getPenghuniByAset(aset.value.id);
        let penghuniArr = [];
        if (penghuniRes && Array.isArray(penghuniRes.data)) {
            penghuniArr = penghuniRes.data.map(item => ({
                warga_id: item.warga_id,
                nama: item.warga?.nama,
                aset_m_status_id: item.aset_m_status_id,
                status_nama: item.status?.nama
            }));
            setAsetPenghuniData(penghuniArr);
        } else {
            clearAsetPenghuniData();
        }
        router.push({ name: 'penghunisettings', params: { id: aset.value.id } });
    } catch (e) {
        if (
            e.response &&
            e.response.data &&
            e.response.data.message === "Data penghuni tidak ditemukan"
        ) {
            clearAsetPenghuniData();
            router.push({ name: 'penghunisettings', params: { id: aset.value.id } });
        } else {
            alert('Gagal mengambil data penghuni');
        }
    }
}

async function handleHapus() {
    showMenu.value = false;
    if (confirm('Yakin ingin menghapus aset ini?')) {
        try {
            await deleteAset(aset.value.id);
            router.push({ name: 'dashboard-wilayah' });
        } catch (e) {
            alert('Gagal menghapus aset');  
        }
    }
}
</script>