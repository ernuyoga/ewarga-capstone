<template>
    <div class="min-h-screen bg-[#f6f6f6]">
        <!-- Header Skeleton -->
        <div v-if="loading" class="px-4 md:px-8 lg:px-16 xl:px-24 pt-4">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
                    <div class="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
        </div>
        <!-- Header -->
        <HeaderForm v-else title="Detail Objek Wilayah" @back="goBack">
            <template #action>
                <div v-if="auth.user?.is_pengurus" class="inline-block relative">
                    <button @click="toggleMenu">
                        <img :src="tombolTitikTiga" alt="Titik Tiga" class="w-6 h-6 mt-1" />
                    </button>
                    <div v-if="showMenu" class="absolute right-0 mt-2 z-50 bg-white rounded-b-xl shadow-lg py-2 w-48">
                        <button class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100" @click="handleUbah">
                            <img src="@/assets/edit_icon.svg" alt="Edit UMKM" class="w-5 h-5 mr-1" />
                            Ubah Aset
                        </button>
                        <button class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
                            @click="handleAturKoordinat">
                            <img src="@/assets/koordinat.svg" alt="Atur Koordinat" class="w-5 h-5 mr-1" />
                            Atur Koordinat
                        </button>
                        <button class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
                            @click="handleAturPenghuni">
                            <img src="@/assets/penghuni.svg" alt="Atur Penghuni" class="w-5 h-5 mr-1" />
                            Atur Penghuni
                        </button>
                        <button class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-red-500"
                            @click="showDeleteModal = true">
                            <img src="@/assets/delete_icon.svg" alt="Hapus Aset" class="w-5 h-5 mr-1" />
                            Hapus Aset
                        </button>
                    </div>
                </div>
            </template>
        </HeaderForm>

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

                <div class="px-4 lg:px-6 py-4 pt-0 lg:py-4">
                    <!-- Info Aset -->
                    <section
                        class="px-1 lg:px-2 py-1 lg:py-2 flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <!-- Mobile: Foto tambahan tetap di bawah -->
                        <div class="block lg:hidden px-0 py-2">
                            <div class="flex gap-2 overflow-x-auto justify-center">
                                <div v-for="(foto, idx) in (aset.fotos || []).slice(0, 5)" :key="foto.id || idx"
                                    class="flex-shrink-0 flex justify-center items-center">
                                    <img :src="getImageUrl(foto.file_path)"
                                        class="w-14 h-14 object-cover rounded-lg border"
                                        :alt="foto.nama || `Foto ${idx + 1}`" />
                                </div>
                            </div>
                        </div>

                        <div class="flex w-full">
                            <!-- Kiri: Info aset -->
                            <div class="flex-1 flex flex-col justify-center min-w-0" style="flex-basis: 50%;">
                                <div class="text-xl lg:text-2xl font-bold mb-2 mt-2 lg:mt-0 truncate">{{ aset.nama }}
                                </div>
                                <div
                                    class="text-sm lg:text-base text-gray-500 font-semibold mb-2 flex items-center gap-1">
                                    <span>{{ aset.jenis?.nama || '-' }}</span>
                                    <span class="mx-1">|</span>
                                    <span>{{ aset.warga?.nama || '-' }}</span>
                                </div>
                                <div class="text-sm lg:text-base text-gray-500">{{ aset.alamat || '-' }}</div>
                            </div>
                            <!-- Kanan: Foto tambahan -->
                            <div class="hidden lg:flex items-center justify-center ml-8"
                                style="flex-basis: 50%; overflow: hidden;">
                                <div class="flex flex-nowrap gap-2">
                                    <div v-for="(foto, idx) in (aset.fotos || []).slice(0, 5)" :key="foto.id || idx"
                                        class="flex-shrink-0">
                                        <img :src="getImageUrl(foto.file_path)"
                                            class="w-24 h-24 object-cover rounded-lg border"
                                            :alt="foto.nama || `Foto ${idx + 1}`" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Garis pemisah -->
                    <div class="border-t border-gray-200 mt-2 mb-4"></div>

                    <!-- Responsive layout -->
                    <div class="flex flex-col lg:flex-row gap-6 lg:gap-10">
                        <!-- Kiri: Koordinat -->
                        <div class="flex-1">
                            <section class="px-1 lg:px-2 mb-4">
                                <div class="font-bold text-base lg:text-lg mb-2">Koordinat Objek</div>
                                <div v-if="aset.latitude && aset.longitude" class="rounded-lg overflow-hidden mb-2">
                                    <div id="map" class="w-full h-40 lg:h-64"
                                        :style="{ zIndex: previewIdx === null ? 10 : 0 }">
                                    </div>
                                </div>
                                <div v-else
                                    class="flex flex-col items-center justify-center py-6 bg-white rounded-lg border mb-2">
                                    <img src="@/assets/koordinat_with_bg.svg" alt="Koordinat" class="w-24 h-24 mb-4" />
                                    <div class="font-bold text-base text-[#2B2350] mb-3 text-center">Koordinat objek
                                        belum
                                        diatur</div>
                                    <button
                                        class="flex items-center gap-2 px-6 py-2 rounded-full bg-[#03BF8C] text-white font-medium text-base hover:bg-[#00b07b] transition-all"
                                        @click="handleAturKoordinat">
                                        <img src="@/assets/tambah_putih.svg" alt="Tambah" class="w-4 h-4" />
                                        Atur Koordinat
                                    </button>
                                </div>
                                <div class="text-xs lg:text-sm text-gray-500">
                                    <template v-if="aset.latitude && aset.longitude">
                                        {{ aset.latitude }}, {{ aset.longitude }}
                                    </template>
                                </div>
                            </section>
                        </div>
                        <!-- Kanan: Penghuni -->
                        <div class="flex-1">
                            <section class="px-1 lg:px-2 mb-8">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="font-bold text-base lg:text-lg">Penghuni Objek</div>
                                    <button
                                        class="bg-green-100 text-green-500 text-xs lg:text-sm font-bold px-2 py-1 rounded-lg hover:bg-green-200"
                                        @click="lihatSemuaPenghuni">Lihat Semua</button>
                                </div>
                                <div v-if="penghuniList.length === 0"
                                    class="flex flex-col items-center justify-center py-6 bg-white rounded-lg border mb-2">
                                    <img src="@/assets/empty.svg" alt="Belum Ada Penghuni" class="w-24 h-24 mb-4" />
                                    <div class="font-bold text-base text-[#2B2350] mb-3 text-center">
                                        Belum Ada Penghuni Objek yang ditambahkan
                                    </div>
                                    <button
                                        class="flex items-center gap-2 px-6 py-2 rounded-full bg-[#03BF8C] text-white font-medium text-base hover:bg-[#00b07b] transition-all"
                                        @click="handleAturPenghuni">
                                        <img src="@/assets/tambah_putih.svg" alt="Tambah" class="w-4 h-4" />
                                        Atur Penghuni
                                    </button>
                                </div>
                                <div v-else>
                                    <div v-for="(penghuni, index) in penghuniList.slice(0, 3)" :key="index"
                                        class="flex items-center gap-4 mb-3 bg-[#ffffff] border rounded-lg px-4 py-3">
                                        <img :src="getImageUrl(penghuni.foto_path)"
                                            class="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border"
                                            :alt="penghuni.nama"
                                            @error="e => e.target.src = 'https://via.placeholder.com/150'" />
                                        <div class="text-sm lg:text-base">
                                            <div class="font-semibold text-sm lg:text-base">{{ penghuni.nama }}</div>
                                            <div class="text-gray-500">{{ penghuni.status }}</div>
                                            <div class="text-blue-600">{{ penghuni.no_tlp || '—' }}</div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Hapus -->
        <ModalHapus :show="showDeleteModal" @cancel="showDeleteModal = false" @confirm="handleHapus">
            <template #title></template>
            <div class="text-center">Apakah Anda yakin ingin menghapus aset ini? Tindakan ini tidak dapat dibatalkan.
            </div>
        </ModalHapus>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAsetById } from '@/services/wilayahService';
import { getPenghuniByAset, setAsetPenghuniData, clearAsetPenghuniData, deleteAset } from '@/services/penghuniService';
import L from '@/plugins/leaflet.js'
import HeaderForm from '@/components/card/HeaderForm.vue';
import tombolTitikTiga from '@/assets/titik_tiga.png';
import { setAsetEditFormData } from '@/services/asetservice';
import { useAuthStore } from "@/store/auth";
import ModalHapus from "@/components/shared/ModalHapus.vue";
import { getImageUrl } from '@/lib/axios';

const auth = useAuthStore();

const route = useRoute();
const router = useRouter();
const aset = ref({});
const penghuniList = ref([]);
const loading = ref(true);
const showMenu = ref(false);
const showDeleteModal = ref(false);
const previewIdx = computed(() => showDeleteModal.value ? 1 : null);

function toggleMenu(e) {
    if (e) e.stopPropagation();
    showMenu.value = !showMenu.value;
}
function closeMenu() {
    showMenu.value = false;
}
function handleClickOutside(event) {
    if (showMenu.value && !event.target.closest('.relative')) {
        showMenu.value = false;
    }
}

const fotoUtama = computed(() => {
    if (aset.value.fotos && aset.value.fotos.length > 0) {
        return getImageUrl(aset.value.fotos[0].file_path);
    }
    return new URL('@/assets/map.svg', import.meta.url).href;
});

function showMap(retry = 0) {
    if (!aset.value.latitude || !aset.value.longitude) return;
    // Cek apakah elemen map sudah ada di DOM
    const mapEl = document.getElementById('map');
    if (!mapEl) {
        // Retry max 10x dengan delay 100ms
        if (retry < 10) {
            setTimeout(() => showMap(retry + 1), 100);
        }
        return;
    }
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

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside);
});
onMounted(async () => {
    loading.value = true;
    const id = route.params.id;
    if (!id) return;
    try {
        // Ambil detail aset
        const { data } = await getAsetById(id);
        if (data && data.data) {
            aset.value = data.data;
        }
        // Ambil penghuni aset (ambil data lengkap warga)
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
});
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside);
});

watch(aset, async (val) => {
    if (val.latitude && val.longitude) {
        await nextTick();
        setTimeout(showMap, 100);
    }
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
    showDeleteModal.value = false;
    try {
        await deleteAset(aset.value.id);
        router.push({ name: 'dashboard-wilayah' });
    } catch (e) {
        alert('Gagal menghapus aset');
    }
}

function goBack() {
    router.push({ name: 'dashboard-wilayah' });
}
</script>