<template>
    <div class="min-h-screen bg-[#f6f6f6]">
        <!-- Header -->
        <HeaderForm title="Detail UMKM" @back="goToDashboardUmkm">
            <template #action>
                <div class="relative inline-block">
                    <button @click="toggleMenu">
                        <img :src="titikTiga" alt="Menu" class="w-6 h-6" />
                    </button>
                    <div v-if="showMenu"
                        class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50 border border-gray-100"
                        @click.stop>
                        <ul class="py-2">
                            <li @click="handleTambahProduk"
                                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-green-600 font-medium">
                                <span>+</span> Tambah Produk
                            </li>
                            <li @click="handleEditUmkm"
                                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-[#2e5eaa]">
                                <span>✏️</span> Ubah UMKM
                            </li>
                            <li @click="handleHapusUmkm"
                                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-red-500">
                                <span>🗑️</span> Hapus UMKM
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
        </HeaderForm>

        <!-- Skeleton Loader -->
        <div v-if="loading" class="mx-4 md:mx-8 lg:mx-16 xl:mx-24 py-4">
            <div class="w-full h-56 lg:h-64 bg-gray-200 animate-pulse rounded-b-xl mb-4"></div>
            <div class="bg-white rounded-xl shadow px-4 md:px-8 py-4 mb-4 animate-pulse">
                <div class="h-7 w-1/2 bg-gray-200 rounded mb-3"></div>
                <div class="h-5 w-1/3 bg-gray-200 rounded mb-2"></div>
                <div class="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 w-1/2 bg-gray-200 rounded"></div>
            </div>
            <div class="bg-white rounded-xl shadow px-4 md:px-8 py-4 mb-4 animate-pulse">
                <div class="h-5 w-1/4 bg-gray-200 rounded mb-2"></div>
                <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>
            <div class="bg-white rounded-xl shadow px-4 md:px-8 py-4 mb-4 animate-pulse">
                <div class="h-5 w-1/4 bg-gray-200 rounded mb-2"></div>
                <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
            </div>
            <div class="bg-white rounded-xl shadow px-4 md:px-8 py-4 mb-4 animate-pulse">
                <div class="h-5 w-1/4 bg-gray-200 rounded mb-2"></div>
                <div class="space-y-2">
                    <div class="h-4 w-2/3 bg-gray-200 rounded"></div>
                    <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>

        <!-- Container Responsive -->
        <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24">
            <!-- Foto UMKM -->
            <div
                class="w-full h-56 lg:h-64 bg-gray-100 flex items-center justify-center overflow-hidden mb-4 rounded-b-xl">
                <img :src="fotoUtama" class="object-cover w-full h-full" alt="Foto UMKM" />
            </div>

            <Modal :show="showDeleteModal" @cancel="showDeleteModal = false" @confirm="confirmDeleteUmkm">
                <template #title>
                    <div class="text-lg font-bold mb-2">Hapus UMKM</div>
                </template>
                <div>Apakah Anda yakin ingin menghapus UMKM ini? Tindakan ini tidak dapat dibatalkan.</div>
            </Modal>
            <!-- Info UMKM -->
            <section class="bg-white rounded-xl shadow px-4 md:px-8 py-4 mb-4">
                <div class="text-xl lg:text-2xl font-bold mb-2 text-gray-800">{{ umkm.nama }}</div>
                <div class="flex items-center gap-2 text-sm lg:text-base mb-2">
                    <span class="inline-block w-3 h-3 rounded-full"
                        :class="umkm.jenis?.nama === 'Online' ? 'bg-green-400' : 'bg-gray-400'"></span>
                    <span class="font-semibold"
                        :class="umkm.jenis?.nama === 'Online' ? 'text-green-500' : 'text-gray-500'">
                        {{ umkm.jenis?.nama ? 'Usaha ' + umkm.jenis.nama : '-' }}
                    </span>
                    <span class="mx-1 text-gray-400">|</span>
                    <span class="text-gray-600">{{ umkm.bentuk?.nama || '-' }}</span>
                </div>
                <div class="text-gray-500 text-sm lg:text-base mb-3 truncate">{{ umkm.alamat || '-' }}</div>
                <div class="text-gray-400 text-xs lg:text-sm mb-2">{{ umkm.keterangan }}</div>
            </section>

            <!-- Kontak Usaha -->
            <section class="bg-white rounded-xl shadow px-4 md:px-8 py-4 mb-4">
                <div class="font-semibold mb-1 text-sm lg:text-base">Kontak Usaha</div>
                <ul class="text-sm lg:text-base text-gray-700">
                    <li v-for="kontak in umkm.kontaks" :key="kontak.id">
                        • {{ kontak.jenis_kontak }}: {{ kontak.kontak }}
                    </li>
                    <li v-if="!umkm.kontaks || umkm.kontaks.length === 0" class="text-gray-400">Tidak ada kontak.</li>
                </ul>
            </section>

            <!-- Koordinat Objek -->
            <section class="bg-white rounded-xl shadow px-4 md:px-8 py-4 mb-4">
                <div class="font-semibold mb-1 text-sm lg:text-base">Koordinat Objek</div>
                <div class="rounded-lg overflow-hidden mb-1">
                    <div id="map" class="w-full h-32" style="height: 130px;"></div>
                </div>
                <div class="text-xs text-gray-500">
                    {{ umkm.lokasi_point?.latitude }}, {{ umkm.lokasi_point?.longitude }}
                </div>
            </section>

            <!-- Produk -->
            <section class="bg-white rounded-xl shadow px-4 md:px-8 py-4 mb-4">
                <div class="flex items-center justify-between mb-2">
                    <div class="font-semibold text-sm lg:text-base">Produk</div>
                    <button @click="goToAddProduk" class="p-1">
                        <img :src="tombolTambah" alt="Tambah Produk" class="w-6 h-6" />
                    </button>
                </div>
                <div class="relative mb-2">
                    <input v-model="searchProduk" type="text" placeholder="Cari nama produk..."
                        class="px-3 py-2 border border-gray-300 rounded-lg text-sm lg:text-base w-full" />
                    <i class="icon-search absolute right-2 top-3 text-gray-400"></i>
                </div>
                <div v-if="filteredProduk.length === 0" class="text-gray-400 text-sm lg:text-base text-center py-4">
                    Tidak ada produk.
                </div>
                <div v-for="produk in filteredProduk" :key="produk.id"
                    class="flex items-center gap-3 bg-gray-50 rounded-xl mb-2 p-3 cursor-pointer hover:bg-gray-100 transition"
                    @click="goToProdukDetail(produk.id)">
                    <img :src="produk.fotos && produk.fotos.length > 0 ? getImageUrl(produk.fotos[0].file_path) : defaultImage"
                        class="w-16 h-16 object-cover rounded-lg" alt="Foto Produk" />
                    <div class="flex-1">
                        <div class="font-semibold text-sm lg:text-base">{{ produk.nama }}</div>
                        <div class="text-xs text-gray-500 mb-1">
                            {{ produk.keterangan && produk.keterangan.length > 80
                                ? produk.keterangan.slice(0, 80) + '...'
                                : produk.keterangan }}
                        </div>
                        <div class="text-green-600 font-bold text-base lg:text-lg">
                            Rp{{ produk.harga?.toLocaleString() }}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getUmkmById } from "@/services/umkmService";
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import tombolTambah from '@/assets/tombol_tambah.svg';
import { setProdukFormData } from "@/services/produkService";
import titikTiga from '@/assets/titik_tiga.png';
import HeaderForm from '@/components/card/HeaderForm.vue';
import { setEditUmkmFormData } from '@/services/umkmService'
import Modal from '@/components/shared/Modal.vue';
import { deleteUmkm } from "@/services/umkmService";
import { getImageUrl } from '@/lib/axios'; // Tambahkan ini

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