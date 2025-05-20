<template>
    <div class="bg-gray-100 min-h-screen">
        <HeaderForm title="Tambah Data" @back="goBack">
            <template #action>
                <div class="relative inline-block">
                    <button @click="toggleMenu">
                        <img :src="titikTiga" alt="Menu" class="w-6 h-6" />
                    </button>
                    <div v-if="showMenu"
                        class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50 border border-gray-100"
                        @click.stop>
                        <ul class="py-2">
                            <li @click="handleEditProduk"
                                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-[#2e5eaa]">
                                <span>✏️</span> Ubah Produk
                            </li>
                            <li @click="showDeleteModal = true"
                                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer text-red-500">
                                <span>🗑️</span> Hapus Produk
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
        </HeaderForm>

        <!-- Gambar Produk -->
        <div v-if="produk && produk.fotos && produk.fotos.length"
            class="w-full h-48 bg-gray-200 flex items-center justify-center">
            <img :src="getImageUrl(produk.fotos[0].file_path)" alt="Foto Produk" class="object-cover w-full h-full" />
        </div>

        <!-- Card Detail Produk -->
        <div class="bg-white rounded-lg shadow mx-auto mt-[-40px] p-5 max-w-md relative z-10">
            <div class="flex justify-between items-center mb-2">
                <div>
                    <div class="text-lg font-bold">{{ produk?.nama }}</div>
                    <div class="text-sm text-gray-500">{{ produk?.umkm?.nama }}</div>
                </div>
                <div class="text-lg font-bold text-green-500">
                    {{ formatRupiah(produk?.harga) }}
                </div>
            </div>
            <hr class="my-2" />
            <div>
                <div class="font-semibold mb-1">Produk</div>
                <div class="text-sm text-gray-700" v-html="produk?.keterangan"></div>
            </div>
        </div>
    </div>
    <Modal :show="showDeleteModal" @cancel="showDeleteModal = false" @confirm="confirmDeleteProduk">
        <template #title>
            <div class="text-lg font-bold mb-2">Hapus Produk</div>
        </template>
        <div>Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.</div>
    </Modal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderForm from '@/components/card/HeaderForm.vue'
import Modal from '@/components/shared/Modal.vue'
import { getProdukById, setEditProdukFormData, mapProdukDetailToForm, deleteProduk } from '@/services/produkService'
import titikTiga from '@/assets/titik_tiga.png';

const route = useRoute()
const router = useRouter()
const produk = ref(null)
const showMenu = ref(false)
const showDeleteModal = ref(false)
const deleting = ref(false)

// Ganti dengan base URL API Anda
const BASE_IMAGE_URL = 'https://your-api-url.com/storage/'

function getImageUrl(path) {
    return BASE_IMAGE_URL + path
}

function formatRupiah(value) {
    if (!value) return ''
    return 'Rp' + value.toLocaleString('id-ID')
}

onMounted(async () => {
    const id = route.params.id
    try {
        const res = await getProdukById(id)
        if (res.status && res.data) {
            produk.value = res.data
        }
    } catch (e) {
        // Handle error
    }
})

function goBack() {
    router.back();
}

function toggleMenu(e) {
    e.stopPropagation();
    showMenu.value = !showMenu.value;
}

async function handleEditProduk() {
    showMenu.value = false;
    const id = route.params.id;
    const res = await getProdukById(id);
    if (res.status && res.data) {
        setEditProdukFormData(mapProdukDetailToForm(res.data));
    }
    router.push({ name: 'produkedit', params: { id } });
}

async function confirmDeleteProduk() {
    deleting.value = true;
    try {
        await deleteProduk(produk.value.id);
        showDeleteModal.value = false;
        router.push({ name: "umkm-detail", params: { id: produk.value.umkm_id } });
    } catch (e) {
        alert("Gagal menghapus produk.");
    }
    deleting.value = false;
}
</script>