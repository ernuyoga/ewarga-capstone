<template>
    <div class="min-h-screen bg-[#f6f6f6] flex flex-col">
        <!-- Header -->
        <HeaderForm title="Ubah Produk" @back="goBack" />
        <PopupMessage :show="showWarning" type="warning" title="Lengkapi data terlebih dahulu" :text="warningText"
            listLabel="Field berikut wajib diisi:" @close="showWarning = false" />

        <!-- StepperHeader -->
        <StepperHeader step-label="1/2" title="Pengisian Data" subtitle="Selanjutnya: Konfirmasi Data" />

        <!-- Form Produk -->
        <form class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6 flex flex-col gap-3">
            <!-- Nama Produk -->
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Nama Produk<span class="text-[#ff5a5f]">*</span>
                </label>
                <input type="text" v-model="namaProduk" maxlength="255"
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
                    <input type="number" v-model="harga" min="0" maxlength="9" :max="999999999" @input="onHargaInput"
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
                <textarea v-model="keterangan" maxlength="255"
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
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getEditProdukFormData, setEditProdukFormData } from '@/services/produkService'
import HeaderForm from '@/components/card/HeaderForm.vue'
import StepperHeader from '@/components/card/StepperHeader.vue'
import PopupMessage from '@/components/shared/PopupMessage.vue'

const route = useRoute()
const router = useRouter()
const namaProduk = ref("")
const harga = ref("")
const keterangan = ref("")
const gambarProdukLabel = ref("")
const fotos = ref([])
const showWarning = ref(false)
const warningText = ref([])

function onHargaInput(e) {
    let val = e.target.value.replace(/\D/g, '').slice(0, 9)
    harga.value = val
}

onMounted(() => {
    const formData = getEditProdukFormData();
    namaProduk.value = formData.nama || "";
    harga.value = formData.harga || "";
    keterangan.value = formData.keterangan || "";
    fotos.value = formData.fotos || [];
    gambarProdukLabel.value = fotos.value.length ? `${fotos.value.length} Gambar Produk` : "";
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
    const missing = []
    if (!namaProduk.value) missing.push('Nama Produk')
    if (!harga.value) missing.push('Harga Produk')
    if (fotos.value.length === 0) missing.push('Gambar Produk')
    if (!keterangan.value) missing.push('Keterangan')

    if (missing.length) {
        warningText.value = missing
        showWarning.value = true
        return
    }
    router.push({ name: 'produkeditconfirmation', params: { id: route.params.id } });
}

function goBack() {
    const produkData = getEditProdukFormData();
    const umkmId = produkData.umkm_id;
    router.push({ name: 'umkm-detail', params: { id: umkmId } });
}
</script>