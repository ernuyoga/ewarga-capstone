<template>
    <div class="min-h-screen bg-[#f6f6f6]">
        <!-- Header -->
        <HeaderForm title="Detail Produk" @back="goBack">
            <template #action>
                <div class="inline-block relative">
                    <button @click="toggleMenu">
                        <img :src="titikTiga" alt="Menu" class="w-6 h-6 mt-1" />
                    </button>
                    <div v-if="showMenu" class="absolute right-0 mt-2 z-50 bg-white rounded-b-xl shadow-lg py-2 w-48"
                        style="max-width: 320px;">
                        <button class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
                            @click="handleEditProduk">
                            <img src="@/assets/edit_icon.svg" alt="Edit Produk" class="w-5 h-5 mr-1" />
                            Ubah Produk
                        </button>
                        <div class="border-t border-gray-200"></div>
                        <button class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-red-500"
                            @click="showDeleteModal = true">
                            <img src="@/assets/delete_icon.svg" alt="Hapus Produk" class="w-5 h-5 mr-1" />
                            Hapus Produk
                        </button>
                    </div>
                </div>
            </template>
        </HeaderForm>

        <!-- Card Detail Produk -->
        <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24">
            <div class="bg-white rounded-xl shadow my-4">
                <!-- Skeleton Loader -->
                <template v-if="loading">
                    <div class="animate-pulse">
                        <div class="w-full h-56 lg:h-72 rounded-t-xl bg-gray-200"></div>
                        <div class="px-2 py-2 flex gap-2 items-center justify-center">
                            <div v-for="i in 5" :key="i" class="w-14 h-14 lg:w-28 lg:h-28 bg-gray-200 rounded-lg"></div>
                        </div>
                        <hr class="border-t border-gray-200 my-2" />
                        <div class="px-4 lg:px-8 py-4 pt-0 lg:py-4">
                            <section
                                class="px-1 lg:px-2 py-1 lg:py-2 flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                <div class="flex-1 w-full">
                                    <div class="flex items-center justify-between">
                                        <div class="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                                        <div class="h-6 w-24 bg-gray-200 rounded ml-4"></div>
                                    </div>
                                    <div class="h-4 w-40 bg-gray-200 rounded mb-4"></div>
                                    <div class="h-5 w-28 bg-gray-200 rounded mb-2 mt-2"></div>
                                    <div class="h-20 w-full bg-gray-200 rounded"></div>
                                </div>
                            </section>
                        </div>
                    </div>
                </template>

                <!-- Gambar Produk Utama -->
                <template v-else>
                    <img :src="produk && produk.fotos && produk.fotos.length > 0 ? getImageUrl(produk.fotos[0].file_path) : ''"
                        alt="Foto Produk" class="w-full h-56 lg:h-72 rounded-t-xl object-cover border-b" />

                    <!-- Foto tambahan (semua layar, di bawah foto utama) -->
                    <div v-if="produk && produk.fotos && produk.fotos.length > 1" class="px-2 py-2">
                        <div class="flex gap-2 overflow-x-auto justify-center">
                            <div v-for="(foto, idx) in produk.fotos.slice(0, 5)" :key="foto.id || idx"
                                class="flex-shrink-0 flex justify-center items-center">
                                <img :src="getImageUrl(foto.file_path)"
                                    class="w-14 h-14 lg:w-28 lg:h-28 object-cover rounded-lg border"
                                    :alt="foto.nama || `Foto ${idx + 2}`" />
                            </div>
                        </div>
                    </div>

                    <hr class="border-t border-gray-200 my-2" />

                    <div class="px-4 lg:px-8 py-4 pt-0 lg:py-4">
                        <section
                            class="px-1 lg:px-2 py-1 lg:py-2 flex flex-col lg:flex-row lg:items-start lg:justify-between">
                            <div class="flex-1 w-full">
                                <div class="flex items-center justify-between">
                                    <div class="text-xl lg:text-2xl font-bold">{{ produk?.nama }}</div>
                                    <div class="text-green-600 font-bold text-base lg:text-lg ml-4 whitespace-nowrap">
                                        {{ formatRupiah(produk?.harga) }}
                                    </div>
                                </div>
                                <div class="text-sm lg:text-base text-gray-500 font-semibold mb-4">{{ produk?.umkm?.nama
                                    }}
                                </div>
                                <div class="font-bold text-base lg:text-lg mb-1 mt-2">Deskripsi</div>
                                <div class="text-sm lg:text-base text-gray-700" v-html="produk?.keterangan"></div>
                            </div>
                        </section>
                    </div>
                </template>
            </div>
        </div>

        <ModalHapus :show="showDeleteModal" @cancel="showDeleteModal = false" @confirm="confirmDeleteProduk">
            <template #title>
                <div class="text-lg font-bold mb-2">Hapus Produk</div>
            </template>
            <div class="text-center">Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
            </div>
        </ModalHapus>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderForm from '@/components/card/HeaderForm.vue'
import { getProdukById, setEditProdukFormData, mapProdukDetailToForm, deleteProduk } from '@/services/produkService'
import titikTiga from '@/assets/titik_tiga.png'
import { getImageUrl } from '@/lib/axios'
import ModalHapus from '../../components/shared/ModalHapus.vue'

const route = useRoute()
const router = useRouter()
const produk = ref(null)
const showMenu = ref(false)
const showDeleteModal = ref(false)
const deleting = ref(false)
const loading = ref(true) // Tambahkan state loading

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
    loading.value = false // Set loading selesai
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