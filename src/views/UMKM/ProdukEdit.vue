<template>
    <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
        <HeaderForm title="Ubah Produk" @back="goBack" />

        <!-- Stepper & Judul -->
        <div class="bg-white rounded-xl mx-4 mt-4 p-4 flex items-center justify-between">
            <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-full bg-[#a8f0ce] flex items-center justify-center">
                    <span class="text-xl font-semibold text-[#00c48c]">1/2</span>
                </div>
            </div>
            <div class="flex-1 ml-4 flex flex-col items-end">
                <div class="text-lg font-semibold text-[#232360]">Pengisian Data</div>
                <div class="text-sm text-gray-400">Selanjutnya : Konfirmasi Data</div>
            </div>
        </div>

        <!-- Form Produk -->
        <form class="bg-white rounded-xl mx-4 mt-4 p-4 flex flex-col gap-3">
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Nama Produk<span class="text-[#ff5a5f]">*</span>
                </label>
                <input type="text" v-model="namaProduk"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c48c]" />
            </div>
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Harga Produk<span class="text-[#ff5a5f]">*</span>
                </label>
                <input type="number" v-model="harga"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c48c]" />
            </div>
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Keterangan
                </label>
                <textarea v-model="keterangan"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c48c]"
                    rows="2" placeholder="Masukkan Keterangan ..."></textarea>
            </div>
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Gambar Produk
                </label>
                <div class="relative">
                    <div @click="goToImageUploader" class="relative cursor-pointer">
                        <input type="text"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#00c48c] bg-white cursor-pointer"
                            readonly :value="gambarProdukLabel" placeholder="Pilih Gambar Produk" />
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">&#8250;</span>
                    </div>
                </div>
            </div>
        </form>

        <!-- Tombol Selanjutnya -->
        <button @click="handleNext"
            class="mx-4 mt-4 mb-6 py-3 rounded-xl bg-[#00c48c] text-white font-bold text-lg shadow hover:bg-[#00b07b] transition">
            SELANJUTNYA
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderForm from '@/components/card/HeaderForm.vue'
import { getEditProdukFormData, setEditProdukFormData } from '@/services/produkService'

const route = useRoute()
const router = useRouter()
const namaProduk = ref("")
const harga = ref("")
const keterangan = ref("")
const gambarProdukLabel = ref("")
const fotos = ref([])

onMounted(() => {
    const formData = getEditProdukFormData();
    namaProduk.value = formData.nama || "";
    harga.value = formData.harga || "";
    keterangan.value = formData.keterangan || "";
    fotos.value = formData.fotos || [];
    gambarProdukLabel.value = fotos.value.length ? `${fotos.value.length} Gambar` : "";
});

watch([namaProduk, harga, keterangan, fotos], () => {
    setEditProdukFormData({
        nama: namaProduk.value,
        harga: harga.value,
        keterangan: keterangan.value,
        fotos: fotos.value
    });
});

function goToImageUploader() {
    router.push({ name: 'produkeditimage' })
}

function handleNext() {
    if (!namaProduk.value || !harga.value) {
        alert('Mohon lengkapi semua data wajib terlebih dahulu!');
        return;
    }
    router.push({ name: 'produkeditconfirmation', params: { id: route.params.id } });
}

function goBack() {
    const produkData = getEditProdukFormData();
    const umkmId = produkData.umkm_id;
    router.push({ name: 'umkm-detail', params: { id: umkmId } });
}
</script>