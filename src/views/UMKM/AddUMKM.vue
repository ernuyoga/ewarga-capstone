<!-- AddUMKM.vue -->
<template>
    <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
        <!-- Header -->
        <HeaderForm title="Tambah UMKM Baru" @back="$router.back()" />

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

        <!-- Form -->
        <form class="bg-white rounded-xl mx-4 mt-4 p-4 flex flex-col gap-3">
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Nama Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <input type="text" v-model="namaUsaha"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c48c]" />
            </div>
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Moda Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <select v-model="selectedJenis"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#00c48c]">
                        <option disabled value="">Pilih Moda Usaha</option>
                        <option v-for="j in jenisList" :key="j.id" :value="j.id">{{ j.nama }}</option>
                    </select>
                    <span
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">&#9662;</span>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Bentuk Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <select v-model="selectedBentuk"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#00c48c]">
                        <option disabled value="">Pilih Bentuk Usaha</option>
                        <option v-for="b in bentukList" :key="b.id" :value="b.id">{{ b.nama }}</option>
                    </select>
                    <span
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">&#9662;</span>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Pemilik Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <div @click="goToPemilikForm" class="relative cursor-pointer">
                        <input type="text"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#00c48c] bg-white cursor-pointer"
                            readonly :value="pemilikLabel" placeholder="Pilih Pemilik Usaha" />
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">&#8250;</span>
                    </div>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Alamat Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <input type="text" v-model="alamat"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c48c]"
                    placeholder="Masukkan Alamat Usaha" />
            </div>
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Lokasi Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <div @click="goToKoordinatForm" class="relative cursor-pointer ">
                    <input type="text"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#00c48c]"
                        readonly :value="lokasiLat && lokasiLng ? `${lokasiLat}, ${lokasiLng}` : ''"
                        placeholder="Pilih Lokasi Usaha di Peta" />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">&#8250;</span>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Gambar Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <div @click="goToImageUploader" class="relative cursor-pointer">
                        <input type="text"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#00c48c] bg-white cursor-pointer"
                            readonly :value="gambarUsahaLabel" placeholder="Pilih Gambar Usaha" />
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">&#8250;</span>
                    </div>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Kontak Usaha<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <div @click="goToKontakForm" class="relative cursor-pointer">
                        <input type="text"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#00c48c] bg-white cursor-pointer"
                            readonly :value="kontakLabel" placeholder="Tambah Kontak Usaha" />
                        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">&#8250;</span>
                    </div>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-[#232360] mb-1">
                    Keterangan
                </label>
                <textarea v-model="keterangan"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00c48c]"
                    rows="2" placeholder="Masukkan Keterangan ..."></textarea>
            </div>
        </form>

        <!-- Tombol Selanjutnya -->
        <SubmitButton @submit="handleNext" />
    </div>
</template>

<script setup>
console.log(JSON.parse(localStorage.getItem('umkm_form_data')));
import { ref, onMounted, watch } from 'vue'
import HeaderForm from '@/components/card/HeaderForm.vue'
import SubmitButton from '@/components/card/SubmitButton.vue'
import { useRouter } from 'vue-router'
import { getUmkmMaster } from "@/services/masterService"
import { setUmkmFormData, clearUmkmFormData, getUmkmFormData } from "@/services/umkmService"

const router = useRouter()
const gambarUsahaLabel = ref('')
const pemilikLabel = ref('')

const jenisList = ref([])
const bentukList = ref([])
const selectedJenis = ref("")
const selectedBentuk = ref("")
const namaUsaha = ref("")
const keterangan = ref("")
const alamat = ref("")
const lokasiLat = ref("")
const lokasiLng = ref("")
const kontakLabel = ref("")

function goToKontakForm() {
    router.push({ name: 'kontak' })
}

onMounted(async () => {
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
    const formData = getUmkmFormData()
    namaUsaha.value = formData.nama_usaha || ""
    selectedJenis.value = formData.umkm_m_jenis_id || ""
    selectedBentuk.value = formData.umkm_m_bentuk_id || ""
    if (formData.pemilik_ids && Array.isArray(formData.pemilik_ids) && formData.pemilik_ids.length > 0) {
        pemilikLabel.value = `${formData.pemilik_ids.length} Pemilik Usaha`
    } else {
        pemilikLabel.value = ''
    }
    alamat.value = formData.alamat || ""
    lokasiLat.value = formData.lokasi_lat || ""
    lokasiLng.value = formData.lokasi_lng || ""
    if (formData.kontak && Array.isArray(formData.kontak) && formData.kontak.length > 0) {
        kontakLabel.value = `${formData.kontak.length} Kontak`
    } else {
        kontakLabel.value = ''
    }
    gambarUsahaLabel.value = formData.gambar_count && formData.gambar_count > 0 ? `${formData.gambar_count} Gambar Usaha` : ''
    keterangan.value = formData.keterangan || ""
})

watch([namaUsaha, selectedJenis, selectedBentuk, alamat, keterangan], () => {
    setUmkmFormData({
        nama_usaha: namaUsaha.value,
        umkm_m_jenis_id: selectedJenis.value,
        umkm_m_bentuk_id: selectedBentuk.value,
        alamat: alamat.value,
        keterangan: keterangan.value,
    })
})

function goToImageUploader() {
    router.push({ name: 'uploadView' })
}

function goToPemilikForm() {
    router.push({ name: 'pemilik' })
}

function goToKoordinatForm() {
    router.push({ name: 'koordinatumkm' })
}

const handleNext = () => {
    localStorage.setItem('umkm_form_data', JSON.stringify([]));
};
</script>