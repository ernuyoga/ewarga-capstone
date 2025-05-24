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
        <HeaderForm v-else title="Detail UMKM" @back="goToDashboardUmkm">
            <template #action>
                <div v-if="isPengurus || isPemilik" class="inline-block relative">
                    <button @click="toggleMenu">
                        <img :src="titikTiga" alt="Menu" class="w-6 h-6 mt-1" />
                    </button>
                    <div v-if="showMenu" class="absolute right-0 mt-2 z-50 bg-white rounded-b-xl shadow-lg py-2 w-48"
                        style="max-width: 320px;">
                        <button class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
                            @click="handleTambahProduk">
                            <img src="@/assets/tambah_hijau.svg" alt="Tambah Produk" class="w-5 h-5 mr-1" />
                            Tambah Produk
                        </button>
                        <div class="border-t border-gray-200"></div>
                        <button class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
                            @click="handleEditUmkm">
                            <img src="@/assets/edit_icon.svg" alt="Edit UMKM" class="w-5 h-5 mr-1" />
                            Ubah UMKM
                        </button>
                        <button v-if="isPengurus"
                            class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-red-500"
                            @click="handleHapusUmkm">
                            <img src="@/assets/delete_icon.svg" alt="Hapus UMKM" class="w-5 h-5 mr-1" />
                            Hapus UMKM
                        </button>
                    </div>
                </div>
            </template>
        </HeaderForm>
        <Preview :show="showPreview" :src="previewSrc" @close="closePreview" />

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
                                <div class="h-4 lg:h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div class="h-3 lg:h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                                <div class="h-3 lg:h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div v-else class="bg-white rounded-xl shadow my-4">
                <!-- Foto -->
                <img :src="fotoUtama" class="w-full h-56 lg:h-72 rounded-t-xl object-cover"
                    @click="openPreview(fotoUtama)" />

                <!-- Foto tambahan (mobile only) -->
                <div class="block lg:hidden px-2 py-2">
                    <div class="flex gap-2 overflow-x-auto justify-center">
                        <div v-for="(foto, idx) in (umkm.fotos || []).slice(0, 5)" :key="foto.id || idx"
                            class="flex-shrink-0 flex justify-center items-center">
                            <img :src="getImageUrl(foto.file_path)" class="w-14 h-14 object-cover rounded-lg border"
                                :alt="foto.nama || `Foto ${idx + 1}`"
                                @click="openPreview(getImageUrl(foto.file_path))" />
                        </div>
                    </div>
                </div>

                <div class="px-4 lg:px-6 py-4 pt-0 lg:py-4">
                    <!-- Info UMKM + Foto tambahan (desktop) -->
                    <section
                        class="px-1 lg:px-2 py-1 lg:py-2 flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div class="flex-1">
                            <div class="text-xl lg:text-2xl font-bold mb-2">{{ umkm.nama }}</div>
                            <div class="text-sm lg:text-base text-gray-500 font-semibold mb-2 flex items-center gap-1">
                                <span class="w-2.5 h-2.5 rounded-full"
                                    :class="umkm.jenis?.id === 2 ? 'bg-gray-400' : 'bg-green-400'"></span>
                                <span class="text-sm lg:text-base font-bold"
                                    :class="umkm.jenis?.id === 2 ? 'text-gray-500' : 'text-green-500'">
                                    {{ umkm.jenis?.nama || '-' }}
                                </span>
                                | {{ umkm.bentuk?.nama || '-' }}
                            </div>
                            <div class="text-sm lg:text-base text-gray-500">{{ umkm.alamat || '-' }}</div>
                            <div class="text-xs lg:text-sm text-gray-400 mt-2">{{ umkm.keterangan }}</div>
                        </div>
                        <!-- Foto tambahan (desktop only) -->
                        <div class="hidden lg:flex gap-2 ml-8 mt-2">
                            <div v-for="(foto, idx) in (umkm.fotos || []).slice(0, 5)" :key="foto.id || idx"
                                class="flex-shrink-0 flex justify-center items-center">
                                <img :src="getImageUrl(foto.file_path)" class="w-28 h-28 object-cover rounded-lg border"
                                    :alt="foto.nama || `Foto ${idx + 1}`"
                                    @click="openPreview(getImageUrl(foto.file_path))" />
                            </div>
                        </div>
                    </section>

                    <!-- Garis pemisah -->
                    <div class="border-t border-gray-200 mt-2 mb-4"></div>

                    <!-- Responsive layout -->
                    <div class="flex flex-col lg:flex-row gap-6 lg:gap-10">
                        <!-- Kiri: Kontak & Koordinat (desktop), Kontak/Koordinat/Produk (mobile) -->
                        <div class="flex-1">
                            <!-- Kontak Usaha -->
                            <section class="px-1 lg:px-2 mb-8">
                                <div class="font-bold text-base lg:text-lg mb-2">Kontak Usaha</div>
                                <ul class="text-sm lg:text-base text-gray-700 mb-4">
                                    <li
                                        v-for="kontak in umkm.kontaks"
                                        :key="kontak.id"
                                        class="break-all whitespace-pre-line"
                                    >
                                        • {{ kontak.jenis_kontak }}: {{ kontak.kontak }}
                                    </li>
                                    <li v-if="!umkm.kontaks || umkm.kontaks.length === 0" class="text-gray-400">
                                        Tidak ada kontak.
                                    </li>
                                </ul>
                            </section>
                            <!-- Koordinat (desktop & mobile) -->
                            <section class="px-1 lg:px-2 mb-4">
                                <div class="font-bold text-base lg:text-lg mb-2">Koordinat Objek</div>
                                <div class="rounded-lg overflow-hidden mb-2">
                                    <div id="map" class="w-full h-40 lg:h-64"
                                        :style="{ zIndex: previewIdx === null ? 10 : 0 }">
                                    </div>
                                </div>
                                <div class="text-xs lg:text-sm text-gray-500">
                                    {{ umkm.lokasi_point?.latitude }}, {{ umkm.lokasi_point?.longitude }}
                                </div>
                            </section>
                            <!-- Produk (mobile only, tampil di bawah sendiri) -->
                            <section class="px-1 lg:px-2 mb-4 block lg:hidden">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="font-bold text-base lg:text-lg">Produk</div>
                                    <button v-if="isPengurus || isPemilik" @click="goToAddProduk"
                                        class="flex items-center justify-center w-4 h-4 p-0">
                                        <img src="@/assets/tombol_tambah.svg" alt="Tambah Produk" class="w-5 h-5" />
                                    </button>
                                </div>
                                <div class="relative mb-3">
                                    <input v-model="searchProduk" type="text" placeholder="Cari nama produk..."
                                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm lg:text-base w-full focus:outline-none focus:ring-1 focus:ring-[#03BF8C]" />
                                    <img src="@/assets/search_icon.svg" class="absolute right-3 top-3 w-4 h-4"
                                        alt="Info" />
                                </div>
                                <div v-if="filteredProduk.length === 0"
                                    class="text-gray-400 text-sm lg:text-base text-center py-4">
                                    Tidak ada produk.
                                </div>
                                <div v-for="produk in filteredProduk" :key="produk.id"
                                    class="flex items-center gap-3 rounded-xl mb-2 cursor-pointer shadow-md hover:shadow-lg transition"
                                    @click="goToProdukDetail(produk.id)">
                                    <div class="flex-1 min-w-0 flex flex-col justify-between h-full py-2 pl-3">
                                        <div>
                                            <div class="font-semibold text-sm lg:text-base mb-1 truncate">{{ produk.nama }}</div>
                                            <div class="text-xs text-gray-500 mb-1 truncate">
                                                {{ produk.keterangan && produk.keterangan.length > 80
                                                    ? produk.keterangan.slice(0, 80) + '...'
                                                    : produk.keterangan }}
                                            </div>
                                        </div>
                                        <div class="text-green-600 font-bold text-base lg:text-lg mt-2">
                                            Rp{{ produk.harga?.toLocaleString() }}
                                        </div>
                                    </div>
                                    <img :src="produk.fotos && produk.fotos.length > 0 ? getImageUrl(produk.fotos[0].file_path) : defaultImage"
                                        alt="Foto Produk"
                                        class="bg-gray-200 w-24 h-24 rounded-r object-cover flex-shrink-0" />
                                </div>
                            </section>
                        </div>
                        <!-- Kanan: Produk (desktop only) -->
                        <div class="flex-1 hidden lg:block">
                            <section class="px-1 lg:px-2 mb-4">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="font-bold text-base lg:text-lg">Produk</div>
                                    <button v-if="isPengurus || isPemilik" @click="goToAddProduk"
                                        class="flex items-center justify-center w-4 h-4 p-0">
                                        <img src="@/assets/tombol_tambah.svg" alt="Tambah Produk" class="w-5 h-5" />
                                    </button>
                                </div>
                                <div class="relative mb-2">
                                    <input v-model="searchProduk" type="text" placeholder="Cari nama produk..."
                                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm lg:text-base w-full focus:outline-none focus:ring-1 focus:ring-[#03BF8C]" />
                                    <img src="@/assets/search_icon.svg" class="absolute right-3 top-3 w-4 h-4"
                                        alt="Info" />
                                </div>
                                <div v-if="filteredProduk.length === 0"
                                    class="text-gray-400 text-sm lg:text-base text-center py-4">
                                    Tidak ada produk.
                                </div>
                                <div v-for="produk in filteredProduk" :key="produk.id"
                                    class="flex items-center gap-3 rounded-xl mb-2 cursor-pointer shadow-md hover:shadow-lg transition"
                                    @click="goToProdukDetail(produk.id)">
                                    <div class="flex-1 min-w-0 flex flex-col justify-between h-full py-3 pl-4">
                                        <div>
                                            <div class="font-semibold text-sm lg:text-base mb-1 truncate">
                                                {{ produk.nama && produk.nama.length > 80
                                                    ? produk.nama.slice(0, 80) + '...'
                                                    : produk.nama }}
                                            </div>
                                            <div class="text-xs text-gray-500 mb-1 truncate">
                                                {{ produk.keterangan && produk.keterangan.length > 80
                                                    ? produk.keterangan.slice(0, 80) + '...'
                                                    : produk.keterangan }}
                                            </div>
                                        </div>
                                        <div class="text-green-600 font-bold text-base lg:text-lg mt-2">
                                            Rp{{ produk.harga?.toLocaleString() }}
                                        </div>
                                    </div>
                                    <img :src="produk.fotos && produk.fotos.length > 0 ? getImageUrl(produk.fotos[0].file_path) : defaultImage"
                                        alt="Foto Produk"
                                        class="bg-gray-200 w-28 h-28 rounded-r object-cover flex-shrink-0" />
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Hapus -->
        <ModalHapus :show="showDeleteModal" @cancel="showDeleteModal = false" @confirm="confirmDeleteUmkm">
            <template #title>
            </template>
            <div class="text-center">Apakah Anda yakin ingin menghapus UMKM ini? Tindakan ini tidak dapat dibatalkan.
            </div>
        </ModalHapus>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getUmkmById } from "@/services/umkmService";
import L from '@/plugins/leaflet.js'
import { setProdukFormData } from "@/services/produkService";
import titikTiga from '@/assets/titik_tiga.png';
import HeaderForm from '@/components/card/HeaderForm.vue';
import { setEditUmkmFormData } from '@/services/umkmService'
import { deleteUmkm } from "@/services/umkmService";
import { getImageUrl } from '@/lib/axios'; // Tambahkan ini
import ModalHapus from "../../components/shared/ModalHapus.vue";
import { useAuthStore } from "@/store/auth";
import Preview from '@/components/card/Preview.vue'

const defaultImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";
const route = useRoute();
const router = useRouter();
const umkm = ref({});
const produkList = ref([]);
const loading = ref(true);
const searchProduk = ref("");
const showMenu = ref(false);
const showDeleteModal = ref(false);
const deleting = ref(false);
const previewIdx = computed(() => showDeleteModal.value ? 1 : null);
const auth = useAuthStore();
const isPengurus = computed(() => auth.user?.is_pengurus);
const showPreview = ref(false)
const previewSrc = ref('')
const isPemilik = computed(() => {
    if (!auth.user?.umkms || !umkm.value?.id) return false;
    return auth.user.umkms.includes(umkm.value.id);
});

function openPreview(url) {
    previewSrc.value = url
    showPreview.value = true
}
function closePreview() {
    showPreview.value = false
}

onMounted(() => {
    document.addEventListener('click', closeMenu);
});

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

onUnmounted(() => {
    document.removeEventListener('click', closeMenu);
});

function handleTambahProduk() {
    setProdukFormData({ umkm_id: umkm.value.id });
    router.push({ name: 'addproduk' });
    closeMenu();
}

function closeMenu() {
    showMenu.value = false;
}

function toggleMenu(e) {
    e.stopPropagation();
    showMenu.value = !showMenu.value;
}

// Styling & Foto UMKM
const fotoUtama = computed(() => {
    if (umkm.value.fotos && umkm.value.fotos.length > 0) {
        return getImageUrl(umkm.value.fotos[0].file_path);
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

async function handleEditUmkm() {
    const umkmData = umkm.value
    let gambarArr = []
    if (Array.isArray(umkmData.fotos)) {
        gambarArr = umkmData.fotos.map((f, idx) => ({
            id: f.id,
            nama: f.nama,
            file_path: f.file_path,
            file: { name: f.nama || `Foto ${idx + 1}`, type: 'image/png' }
        }))
    }
    setEditUmkmFormData({
        nama_usaha: umkmData.nama || "",
        instansi_id: umkmData.instansi_id || 1,
        umkm_m_jenis_id: umkmData.umkm_m_jenis_id || "",
        umkm_m_bentuk_id: umkmData.umkm_m_bentuk_id || "",
        alamat: umkmData.alamat || "",
        lokasi_lat: umkmData.lokasi_point?.latitude || "",
        lokasi_lng: umkmData.lokasi_point?.longitude || "",
        keterangan: umkmData.keterangan || "",
        pemilik: Array.isArray(umkmData.umkm_wargas) ? umkmData.umkm_wargas.map(w => w.warga_id) : [],
        gambar: gambarArr,
        kontak: Array.isArray(umkmData.kontaks) ? umkmData.kontaks.map(k => ({
            umkm_m_kontak_id: k.umkm_m_kontak_id,
            kontak: k.kontak,
            jenis: k.jenis_kontak || ''
        })) : [],
    })
    router.push({ name: 'umkmedit', params: { id: umkm.value.id } });
}

function goBack() {
    router.back();
}

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

function goToDashboardUmkm() {
    router.push({ name: "dashboard-umkm" });
}

function goToProdukDetail(id) {
    router.push({ name: 'produk-detail', params: { id } });
}

function goToAddProduk() {
    setProdukFormData({ umkm_id: umkm.value.id });
    router.push({ name: 'addproduk' });
}

function handleAdd() {
    router.push({ name: "addumkm" });
}

function handleHapusUmkm() {
    showDeleteModal.value = true;
    closeMenu();
}

async function confirmDeleteUmkm() {
    deleting.value = true;
    try {
        await deleteUmkm(umkm.value.id);
        showDeleteModal.value = false;
        router.push({ name: "dashboard-umkm" });
    } catch (e) {
        alert("Gagal menghapus UMKM.");
    }
    deleting.value = false;
}
</script>