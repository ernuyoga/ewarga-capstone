<template>
    <div class="min-h-screen bg-[#f6f6f6] pb-24">
        <!-- Header -->
        <HeaderForm title="Tambah Objek" @back="$router.back()" />
        <PopupMessage :show="showWarning" type="warning" title="Lengkapi data terlebih dahulu" :text="warningText"
            @close="showWarning = false" />

        <!-- Stepper -->
        <div class="flex items-center gap-4 bg-white rounded-xl shadow px-6 py-4 mx-4 mt-4 md:mx-auto md:max-w-xl">
            <div
                class="w-14 h-14 rounded-full flex items-center justify-center bg-[#e6fff5] text-[#00c48c] text-xl font-bold">
                1/2
            </div>
            <div>
                <div class="text-base md:text-lg font-bold text-gray-800">Pengisian Data</div>
                <div class="text-xs md:text-sm text-gray-400">Selanjutnya : Konfirmasi Data</div>
            </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-xl shadow px-6 py-6 mx-4 mt-6 md:mx-auto md:max-w-xl">
            <form @submit.prevent="handleSubmit" class="space-y-5">
                <!-- Nama Objek -->
                <div>
                    <label class="block font-medium text-gray-700 mb-1">
                        Nama Objek<span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.nama" type="text" required
                        class="w-full border border-gray-200 rounded-lg px-4 py-3 bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#00c48c] text-sm"
                        placeholder="Masukkan nama objek" />
                </div>
                <!-- Jenis Objek -->
                <div>
                    <label class="block font-medium text-gray-700 mb-1">
                        Jenis Objek<span class="text-red-500">*</span>
                    </label>
                    <select v-model="form.jenis_id" required
                        class="w-full border border-gray-200 rounded-lg px-4 py-3 bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#00c48c] text-sm">
                        <option disabled value="">Pilih Jenis Objek</option>
                        <option v-for="status in statusList" :key="status.id" :value="status.id">{{ status.nama }}
                        </option>
                    </select>
                </div>
                <!-- Alamat Objek -->
                <div>
                    <label class="block font-medium text-gray-700 mb-1">
                        Alamat Objek<span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.alamat" type="text" required
                        class="w-full border border-gray-200 rounded-lg px-4 py-3 bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#00c48c] text-sm"
                        placeholder="Masukkan alamat objek" />
                </div>
                <!-- Pemilik Objek -->
                <div>
                    <label class="block font-medium text-gray-700 mb-1">Pemilik Objek</label>
                    <button type="button"
                        class="w-full border border-gray-200 rounded-lg px-4 py-3 bg-[#fafafa] flex items-center justify-between text-sm text-left"
                        @click="selectPemilik">
                        <span class="truncate">{{ form.pemilik || 'Pilih Pemilik' }}</span>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <!-- Gambar Objek -->
                <div>
                    <label class="block font-medium text-gray-700 mb-1">Gambar Objek</label>
                    <button type="button"
                        class="w-full border border-gray-200 rounded-lg px-4 py-3 bg-[#fafafa] flex items-center justify-between text-sm text-left"
                        @click="selectGambar">
                        <span class="truncate">
                            <template v-if="gambarAsetLabel">
                                {{ gambarAsetLabel }}
                            </template>
                            <template v-else>
                                Pilih Gambar
                            </template>
                        </span>
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>

        <!-- Button -->
        <div class="fixed bottom-0 left-0 right-0 bg-transparent px-4 pb-4 z-10">
            <button
                class="w-full bg-[#00c48c] hover:bg-[#00b07b] text-white font-bold py-3 rounded-2xl text-base shadow transition"
                @click="handleSubmit">
                SELANJUTNYA
            </button>
        </div>
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
    setAsetFormData(form.value)
    router.push({ name: 'aseteditconfirmation' })
}
</script>