<template>
    <div class="min-h-screen bg-[#f6f6f6] flex flex-col">
        <!-- Header -->
        <HeaderForm title="Tambah Produk Baru" @back="goBack" />

        <!-- StepperHeader -->
        <StepperHeader step-label="1/2" title="Pengisian Data" subtitle="Selanjutnya: Konfirmasi Data" />

        <!-- Form -->
        <form class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6 flex flex-col gap-3"
            @submit.prevent="handleNext">
            <!-- Nama Produk -->
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Nama Produk<span class="text-[#ff5a5f]">*</span>
                </label>
                <input v-model="nama" type="text"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C]"
                    required />
            </div>
            <!-- Harga Produk -->
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Harga Produk<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Rp</span>
                    <input v-model="harga" type="number" min="0"
                        class="w-full border border-gray-200 rounded-lg px-9 py-2 lg:px-9 lg:py-3 text-sm lg:text-base appearance-none focus:outline-none focus:ring-1 focus:ring-[#03BF8C] hide-number-arrow"
                        required />
                </div>
            </div>
            <!-- Gambar Produk -->
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Gambar Produk<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <div @click="goToImageUploader" class="relative cursor-pointer">
                        <input type="text"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 pr-8 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-white cursor-pointer"
                            readonly :value="gambarProdukLabel" placeholder="Pilih Gambar Produk" />
                        <img src="@/assets/v_kanan.svg" alt="kanan icon"
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
            </div>
            <!-- Keterangan -->
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">Keterangan</label>
                <textarea v-model="keterangan"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C]"
                    rows="3" placeholder="Masukkan Keterangan ..."></textarea>
            </div>
        </form>

        <!-- Tombol Selanjutnya -->
        <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-auto mb-4">
            <button @click="handleNext"
                class="w-full bg-[#03BF8C] text-white font-semibold py-3 rounded-full text-center text-base lg:text-lg hover:bg-[#029e71] transition-all">
                SELANJUTNYA
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import HeaderForm from '@/components/card/HeaderForm.vue'
import StepperHeader from '@/components/card/StepperHeader.vue'
import { setProdukFormData, getProdukFormData } from '@/services/produkService'
import { useRouter } from 'vue-router'

const router = useRouter()
const gambarProdukLabel = ref('')

const produkData = getProdukFormData()
const nama = ref(produkData.nama || '')
const harga = ref(produkData.harga || '')
const keterangan = ref(produkData.keterangan || '')

function goToImageUploader() {
    router.push({ name: 'produkimage' })
}

function updateGambarProdukLabel() {
    const produkData = getProdukFormData()
    const count = produkData.gambar_count || (produkData.fotos ? produkData.fotos.length : 0)
    gambarProdukLabel.value = count > 0 ? `${count} Gambar Produk` : ''
}

onMounted(updateGambarProdukLabel)
window.addEventListener('storage', updateGambarProdukLabel)

watch([nama, harga, keterangan], ([vNama, vHarga, vKeterangan]) => {
    setProdukFormData({
        nama: vNama,
        harga: vHarga,
        keterangan: vKeterangan,
    })
})

function goBack() {
    const produkData = getProdukFormData();
    const umkmId = produkData.umkm_id;
    router.push({ name: 'umkm-detail', params: { id: umkmId } });
}

function handleNext() {
    const produkData = getProdukFormData()
    const count = produkData.gambar_count || (produkData.fotos ? produkData.fotos.length : 0)
    if (!nama.value || !harga.value || count === 0) {
        alert('Nama produk, harga produk, dan gambar produk wajib diisi!');
        return;
    }
    router.push({ name: 'produkconfirm' })
}
</script>