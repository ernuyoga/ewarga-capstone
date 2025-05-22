<!-- AddUMKM.vue -->
<template>
    <div class="min-h-screen bg-[#f6f6f6]">
        <!-- Header -->
        <HeaderForm title="Tambah UMKM Baru" @back="goToUmkmDashboard" />

        <!-- Container Responsive -->
        <div>
            <!-- Stepper & Judul -->
            <StepperHeader step-label="1/2" title="Pengisian Data" subtitle="Selanjutnya: Konfirmasi Data" />

            <!-- Form -->
            <form class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6 flex flex-col gap-3">
                <div>
                    <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                        Nama Usaha<span class="text-[#ff5a5f]">*</span>
                    </label>
                    <input type="text" v-model="namaUsaha"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C]" />
                </div>
                <div>
                    <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                        Moda Usaha<span class="text-[#ff5a5f]">*</span>
                    </label>
                    <div class="relative">
                        <select v-model="selectedJenis" :class="[
                            'w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base appearance-none focus:outline-none focus:ring-1 focus:ring-[#03BF8C]',
                            selectedJenis ? 'text-[#232360]' : 'text-gray-400'
                        ]">
                            <option disabled value="" class="text-gray-400">Pilih Moda Usaha</option>
                            <option v-for="j in jenisList" :key="j.id" :value="j.id" class="text-[#232360]">{{ j.nama }}
                            </option>
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
                        <select v-model="selectedBentuk" :class="[
                            'w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base appearance-none focus:outline-none focus:ring-1 focus:ring-[#03BF8C]',
                            selectedBentuk ? 'text-[#232360]' : 'text-gray-400'
                        ]">
                            <option disabled value="" class="text-gray-400">Pilih Bentuk Usaha</option>
                            <option v-for="b in bentukList" :key="b.id" :value="b.id" class="text-[#232360]">{{ b.nama
                            }}</option>
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
import StepperHeader from '@/components/card/StepperHeader.vue'

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
        kontakLabel.value = `${formData.kontak.length} Kontak Usaha`
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

function goToUmkmDashboard() {
    router.push('/umkm/dashboard')
}

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
    // localStorage.setItem('umkm_form_data', JSON.stringify([]));
    // Validasi field wajib
    if (
        !namaUsaha.value ||
        !selectedJenis.value ||
        !selectedBentuk.value ||
        !pemilikLabel.value ||
        !alamat.value ||
        !lokasiLat.value ||
        !lokasiLng.value ||
        !gambarUsahaLabel.value
    ) {
        alert('Mohon lengkapi semua data wajib terlebih dahulu!');
        return;
    }
    // Jika valid, arahkan ke halaman konfirmasi
    router.push({ name: 'confirmation' });
};
</script>