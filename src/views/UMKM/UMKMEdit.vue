<template>
    <div class="min-h-screen bg-[#f6f6f6]">
        <!-- Header -->
        <HeaderForm title="Ubah UMKM" @back="goBack" />
        <PopupMessage :show="showWarning" type="warning" title="Lengkapi data terlebih dahulu" :text="warningText"
            listLabel="Field berikut wajib diisi:" @close="showWarning = false" />

        <!-- Stepper & Judul -->
        <StepperHeader step-label="1/2" title="Pengisian Data" subtitle="Selanjutnya: Konfirmasi Data" />

        <!-- Form -->
        <form class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6 flex flex-col gap-3">
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Nama Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <input type="text" v-model="namaUsaha" maxlength="255"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C]" />
            </div>
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Moda Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <select v-model="selectedJenis"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base appearance-none focus:outline-none focus:ring-1 focus:ring-[#03BF8C]">
                        <option disabled value="">Pilih Moda Usaha</option>
                        <option v-for="j in jenisList" :key="j.id" :value="j.id">{{ j.nama }}</option>
                    </select>
                    <img src="@/assets/v_hitam.svg" alt="dropdown icon"
                        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
            </div>
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Bentuk Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <select v-model="selectedBentuk"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base appearance-none focus:outline-none focus:ring-1 focus:ring-[#03BF8C]">
                        <option disabled value="">Pilih Bentuk Usaha</option>
                        <option v-for="b in bentukList" :key="b.id" :value="b.id">{{ b.nama }}</option>
                    </select>
                    <img src="@/assets/v_hitam.svg" alt="dropdown icon"
                        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
            </div>
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Pemilik Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <div @click="goToPemilikForm" class="relative cursor-pointer">
                        <input type="text"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 pr-8 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-white cursor-pointer"
                            readonly :value="pemilikLabel" placeholder="Pilih Pemilik Usaha" />
                        <img src="@/assets/v_kanan.svg" alt="kanan icon"
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
            </div>
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Alamat Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <input type="text" v-model="alamat"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C]"
                    placeholder="Masukkan Alamat Usaha" />
            </div>
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Lokasi Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <div @click="goToKoordinatForm" class="relative cursor-pointer ">
                    <input type="text"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 pr-8 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C]"
                        readonly :value="lokasiLat && lokasiLng ? `${lokasiLat}, ${lokasiLng}` : ''"
                        placeholder="Pilih Lokasi Usaha di Peta" />
                    <img src="@/assets/v_kanan.svg" alt="kanan icon"
                        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
            </div>
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Gambar Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <div @click="goToImageUploader" class="relative cursor-pointer">
                        <input type="text"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 pr-8 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-white cursor-pointer"
                            readonly :value="gambarUsahaLabel" placeholder="Pilih Gambar Usaha" />
                        <img src="@/assets/v_kanan.svg" alt="kanan icon"
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
            </div>
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Kontak Usaha
                </label>
                <div class="relative">
                    <div @click="goToKontakForm" class="relative cursor-pointer">
                        <input type="text"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 pr-8 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-white cursor-pointer"
                            readonly :value="kontakLabel" placeholder="Tambah Kontak Usaha" />
                        <img src="@/assets/v_kanan.svg" alt="kanan icon"
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
            </div>
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Keterangan
                </label>
                <textarea v-model="keterangan"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C]"
                    rows="2" placeholder="Masukkan Keterangan ..."></textarea>
            </div>
        </form>

        <!-- Tombol Selanjutnya -->
        <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24">
            <SubmitButton label="SELANJUTNYA" @submit="handleNext" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderForm from '@/components/card/HeaderForm.vue'
import SubmitButton from '@/components/card/SubmitButton.vue'
import { getUmkmMaster } from "@/services/masterService"
import { setEditUmkmFormData, getEditUmkmFormData } from '@/services/umkmService'
import StepperHeader from '@/components/card/StepperHeader.vue'
import PopupMessage from '@/components/shared/PopupMessage.vue'

console.log('Isi localStorage edit_umkm_form_data:', getEditUmkmFormData());
const route = useRoute()
const router = useRouter()
const jenisList = ref([])
const bentukList = ref([])
const selectedJenis = ref("")
const selectedBentuk = ref("")
const namaUsaha = ref("")
const instansi_id = ref("")
const keterangan = ref("")
const alamat = ref("")
const lokasiLat = ref("")
const lokasiLng = ref("")
const gambarUsahaLabel = ref("")
const pemilikLabel = ref("")
const kontakLabel = ref("")
const showWarning = ref(false)
const warningText = ref([])

function goToKontakForm() {
    router.push({ name: 'umkmeditkontak' })
}
function goToImageUploader() {
    router.push({ name: 'umkmeditimage' })
}
function goToPemilikForm() {
    router.push({ name: 'umkmeditpemilik' })
}
function goToKoordinatForm() {
    router.push({ name: 'umkmeditkoordinat' })
}

onMounted(async () => {
    // Tetap fetch master data untuk dropdown
    try {
        const { data } = await getUmkmMaster()
        if (data && data.data) {
            jenisList.value = data.data.jenis || []
            bentukList.value = data.data.bentuk || []
        }
    } catch (e) {
        jenisList.value = []
        bentukList.value = []
    }

    // Ambil data UMKM dari localStorage, BUKAN dari API lagi!
    const formData = getEditUmkmFormData()
    namaUsaha.value = formData.nama_usaha || ""
    instansi_id.value = formData.instansi_id || ""
    selectedJenis.value = formData.umkm_m_jenis_id || ""
    selectedBentuk.value = formData.umkm_m_bentuk_id || ""
    alamat.value = formData.alamat || ""
    lokasiLat.value = formData.lokasi_lat || ""
    lokasiLng.value = formData.lokasi_lng || ""
    keterangan.value = formData.keterangan || ""

    // Label
    pemilikLabel.value = formData.pemilik?.length ? `${formData.pemilik.length} Pemilik Usaha` : ''
    gambarUsahaLabel.value = formData.gambar?.length ? `${formData.gambar.length} Gambar Usaha` : ''
    kontakLabel.value = formData.kontak?.length ? `${formData.kontak.length} Kontak Usaha` : ''
})

// Simpan perubahan ke localStorage setiap field berubah
watch([namaUsaha, selectedJenis, selectedBentuk, alamat, lokasiLat, lokasiLng, keterangan], () => {
    setEditUmkmFormData({
        nama_usaha: namaUsaha.value,
        umkm_m_jenis_id: selectedJenis.value,
        umkm_m_bentuk_id: selectedBentuk.value,
        alamat: alamat.value,
        lokasi_lat: lokasiLat.value,
        lokasi_lng: lokasiLng.value,
        keterangan: keterangan.value,
    })
})

const handleNext = () => {
    const missing = []
    if (!namaUsaha.value) missing.push('Nama Usaha')
    if (!selectedJenis.value) missing.push('Moda Usaha')
    if (!selectedBentuk.value) missing.push('Bentuk Usaha')
    if (!pemilikLabel.value) missing.push('Pemilik Usaha')
    if (!alamat.value) missing.push('Alamat Usaha')
    if (!lokasiLat.value || !lokasiLng.value) missing.push('Lokasi Usaha')
    if (!gambarUsahaLabel.value) missing.push('Gambar Usaha')

    if (missing.length) {
        warningText.value = missing
        showWarning.value = true
        return
    }
    router.push({ name: 'umkmeditconfirmation', params: { id: route.params.id } });
}

function goBack() {
    router.push({ name: 'umkm-detail', params: { id: route.params.id } })
}
</script>