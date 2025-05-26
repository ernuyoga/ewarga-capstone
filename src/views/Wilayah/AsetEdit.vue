<template>
    <div class="min-h-screen bg-[#f6f6f6] pb-24">
        <!-- Header -->
        <HeaderForm title="Edit Objek" @back="goToDashboardWilayah" />
        <PopupMessage :show="showWarning" type="warning" title="Lengkapi data terlebih dahulu" :text="warningText"
            listLabel="Field berikut wajib diisi:" @close="showWarning = false" />

        <!-- Stepper Header -->
        <StepperHeader step-label="1/2" title="Pengisian Data" subtitle="Selanjutnya: Konfirmasi Data" />

        <!-- Form Card -->
        <form @submit.prevent="handleSubmit"
            class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6 flex flex-col gap-3">
            <!-- Nama Objek -->
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Nama Objek<span class="text-[#ff5a5f]">*</span>
                </label>
                <input v-model="form.nama" type="text" 
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C]"
                    placeholder="Masukkan nama objek" />
            </div>
            <!-- Jenis Objek -->
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Jenis Objek<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <select v-model="form.jenis_id"  :class="[
                        'w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base appearance-none focus:outline-none focus:ring-1 focus:ring-[#03BF8C]',
                        form.jenis_id ? 'text-[#232360]' : 'text-gray-400'
                    ]">
                        <option disabled value="" class="text-gray-400">Pilih Jenis Objek</option>
                        <option v-for="jenis in jenisList" :key="jenis.id" :value="jenis.id" class="text-[#232360]">{{
                            jenis.nama }}</option>
                    </select>
                    <img src="@/assets/v_hitam.svg" alt="dropdown icon"
                        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
            </div>
            <!-- Alamat Objek -->
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Alamat Objek<span class="text-[#ff5a5f]">*</span>
                </label>
                <input v-model="form.alamat" type="text"
                    class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C]"
                    placeholder="Masukkan alamat objek" />
            </div>
            <!-- Pemilik Objek -->
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Pemilik Objek<span class="text-[#ff5a5f]">*</span>
                </label>
                <div class="relative">
                    <div @click="selectPemilik" class="relative cursor-pointer">
                        <input type="text"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 pr-8 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-white cursor-pointer"
                            readonly :value="form.pemilik" placeholder="Pilih Pemilik" />
                        <img src="@/assets/v_kanan.svg" alt="kanan icon"
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
            </div>
            <!-- Gambar Objek -->
            <div>
                <label class="block text-sm lg:text-base font-medium text-[#232360] mb-1">
                    Gambar Objek
                </label>
                <div class="relative">
                    <div @click="selectGambar" class="relative cursor-pointer">
                        <input type="text"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 pr-8 text-sm lg:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-white cursor-pointer"
                            readonly :value="gambarAsetLabel" placeholder="Pilih Gambar" />
                        <img src="@/assets/v_kanan.svg" alt="kanan icon"
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
            </div>
            <!-- Tombol Selanjutnya -->
            <div>
                <button type="submit"
                    class="w-full bg-[#00c48c] hover:bg-[#00b07b] text-white font-bold py-3 mt-2 rounded-2xl text-base shadow transition">
                    SELANJUTNYA
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import HeaderForm from '@/components/card/HeaderForm.vue'
import { setAsetFormData, getAsetFormData } from '@/services/asetservice'
import { useRouter } from 'vue-router'
import { getAsetMaster } from "@/services/masterService";
import { useAuthStore } from "@/store/auth";
import { getWargaById } from "@/services/wargaService";
import { getAsetEditFormData, setAsetEditFormData } from '@/services/asetservice'
import PopupMessage from '@/components/shared/PopupMessage.vue'
import StepperHeader from '@/components/card/StepperHeader.vue'

const auth = useAuthStore();
const showWarning = ref(false)
const warningText = ref('')
const router = useRouter()
const jenisList = ref([]);
const statusList = ref([]);
const gambarAsetLabel = computed(() => {
    return form.value.fotos && Array.isArray(form.value.fotos) && form.value.fotos.length > 0
        ? `${form.value.fotos.length} Gambar Aset`
        : ''
})

const form = ref({
    nama: '',
    jenis: '',
    jenis_id: '',
    alamat: '',
    pemilik: '',
    pemilik_id: '',
    instansi_id: '',
    fotos: [],
    hapus_foto: [],
})

onMounted(async () => {
    const saved = getAsetEditFormData();
    Object.assign(form.value, saved);
    try {
        const { data } = await getAsetMaster();
        if (data && data.data) {
            jenisList.value = data.data.jenis || [];
            statusList.value = data.data.status || [];
        }
    } catch (e) {
        jenisList.value = [];
        statusList.value = [];
    }

    if (!form.value.instansi_id && auth.user?.id) {
        const resWarga = await getWargaById(auth.user.id);
        form.value.instansi_id = resWarga.data.data?.instansi_id || "";
    }
});

watch(form, (val) => {
    setAsetEditFormData(val)
}, { deep: true })

function selectPemilik() {
    router.push({ name: 'aseteditpemilik' })
}

function selectGambar() {
    router.push({ name: 'aseteditimage' })
}

function handleSubmit() {
    const missing = []
    if (!form.value.nama) missing.push('Nama Objek')
    if (!form.value.jenis_id) missing.push('Jenis Objek')
    if (!form.value.alamat) missing.push('Alamat Objek')
    if (!form.value.pemilik) missing.push('Pemilik Objek')

    if (missing.length) {
        warningText.value = missing
        showWarning.value = true
        return
    }
    setAsetEditFormData(form.value)
    router.push({ name: 'aseteditconfirmation' })
}

function goToDashboardWilayah() {
    router.push({ name: 'dashboard-wilayah' })
}
</script>