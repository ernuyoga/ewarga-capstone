<template>
    <div class="min-h-screen bg-[#fafafa] flex flex-col">
        <!-- Header -->
        <HeaderForm title="Tambah Produk Baru" @back="goBack" />

        <!-- Stepper -->
        <div class="flex items-center gap-3 bg-white rounded-xl mx-4 mt-4 p-4">
            <div class="flex items-center">
                <div
                    class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 font-bold text-lg">
                    1</div>
            </div>
            <div>
                <div class="font-semibold text-[#232360]">Pengisian Data</div>
                <div class="text-xs text-gray-400">Selanjutnya : Konfirmasi Data</div>
            </div>
        </div>

        <!-- Form -->
        <form class="bg-white rounded-xl mx-4 mt-4 p-4 flex flex-col gap-4" @submit.prevent="handleNext">
            <!-- Nama Produk -->
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">Nama Produk<span
                        class="text-red-500">*</span></label>
                <input v-model="nama" type="text"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c48c]"
                    required />
            </div>
            <!-- Harga Produk -->
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">Harga Produk<span
                        class="text-red-500">*</span></label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Rp</span>
                    <input v-model="harga" type="number" min="0"
                        class="w-full border border-gray-200 rounded-lg px-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c48c]"
                        required />
                </div>
            </div>
            <!-- Gambar Produk -->
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Gambar Produk<span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <div @click="goToImageUploader" class="relative cursor-pointer">
                        <input type="text"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 pr-8 bg-white cursor-pointer"
                            readonly :value="gambarProdukLabel" placeholder="Pilih Gambar Produk" />
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">&#8250;</span>
                    </div>
                </div>
            </div>
            <!-- Keterangan -->
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">Keterangan</label>
                <textarea v-model="keterangan"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c48c]"
                    rows="3" placeholder="Masukkan Keterangan ..."></textarea>
            </div>
        </form>

        <!-- Tombol Selanjutnya -->
        <div class="mt-auto mb-4 px-4">
            <button @click="handleNext"
                class="w-full bg-[#00c48c] text-white font-semibold py-3 rounded-full text-center">SELANJUTNYA</button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import HeaderForm from '@/components/card/HeaderForm.vue'
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
    router.back()
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