<template>
    <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
        <!-- Header -->
        <HeaderForm title="Konfirmasi Data Objek" @back="handleBack" />
        <Preview :show="showPreview" :src="previewSrc" @close="closePreview" />
        <PopupMessage :show="showSuccess" :text="`${form.nama || '-'} telah berhasil ditambahkan!`"
            title="Objek Berhasil ditambah!" type="success" @close="handleSuccessClose" />

        <!-- Stepper Header -->
        <StepperHeader step-label="2/2" title="Konfirmasi Data" subtitle="Selanjutnya: Selesai" />

        <!-- Card Data -->
        <div class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6 flex flex-col gap-4">
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Nama Objek</div>
                <div class="font-semibold text-[#232360] text-base md:text-lg">{{ form.nama || '-' }}</div>
            </div>
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Jenis Objek</div>
                <div class="text-sm md:text-base">
                    {{jenisList.find(j => j.id == form.jenis_id)?.nama || '-'}}
                </div>
            </div>
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Alamat Objek</div>
                <div class="font-semibold text-[#232360] text-base md:text-lg whitespace-pre-line">{{ form.alamat || '-'
                }}</div>
            </div>
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Pemilik Objek</div>
                <div class="text-sm md:text-base">{{ form.pemilik || '-' }}</div>
            </div>
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Gambar Aset</div>
                <div class="flex gap-2 flex-wrap">
                    <div v-for="(img, idx) in form.gambar" :key="idx"
                        class="w-14 h-14 lg:w-16 lg:h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden cursor-pointer"
                        @click="openPreview(idx)">
                        <img v-if="img.url" :src="img.url" class="object-cover w-full h-full"
                            :alt="img.file?.name || `Foto ${idx + 1}`" />
                        <span v-else class="text-gray-400 text-2xl"><i class="icon-image"></i></span>
                    </div>
                    <template v-if="!form.gambar || !form.gambar.length">
                        <div class="w-16 h-16 rounded-lg bg-[#e6fff5] flex items-center justify-center text-[#00c48c]">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 10V6a4 4 0 10-8 0v4M12 14v2m0 0h.01" />
                            </svg>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <!-- Popup Preview -->
        <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div class="relative bg-white rounded-xl p-2 max-w-[90vw] max-h-[90vh] flex flex-col items-center">
                <button @click="closePreview" class="absolute top-2 right-2 text-2xl text-gray-600 hover:text-red-500">
                    &times;
                </button>
                <img v-if="previewSrc" :src="previewSrc" class="max-w-full max-h-[80vh] rounded"
                    :alt="'Preview Gambar'" />
            </div>
        </div>

        <!-- Button -->
        <div class="flex gap-3 px-4 md:px-8 lg:px-16 xl:px-24 mt-4 mb-4">
            <button
                class="flex-1 font-semibold py-3 rounded-full text-center bg-white text-base md:text-lg border border-[#00c48c] text-[#00c48c] shadow-lg mt-4 mb-4"
                @click="handleEdit">
                UBAH
            </button>
            <button
                class="flex-1 bg-[#00c48c] hover:bg-[#00b07b] text-white font-bold py-3 rounded-full text-base md:text-lg shadow-lg mt-4 mb-4"
                @click="handleSubmit">
                SIMPAN
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderForm from '@/components/card/HeaderForm.vue'
import { postAset, getAsetFormData, clearAsetFormData } from '@/services/asetservice'
import { useRouter } from 'vue-router'
import { getAsetMaster } from "@/services/masterService";
import Preview from '@/components/card/Preview.vue'
import PopupMessage from '@/components/shared/PopupMessage.vue'
import StepperHeader from '@/components/card/StepperHeader.vue'

const jenisList = ref([]);
const showPreview = ref(false)
const previewSrc = ref('')
const showSuccess = ref(false);

const router = useRouter()
const form = ref({
    nama: '',
    jenis: '',
    jenis_id: '',
    alamat: '',
    pemilik: '',
    gambar: [],
})

onMounted(async () => {
    const saved = getAsetFormData();
    Object.assign(form.value, saved);
    // Untuk konsistensi, gunakan form.gambar dari form.fotos jika ada
    if (saved.fotos && Array.isArray(saved.fotos)) {
        form.value.gambar = saved.fotos
    }
    try {
        const { data } = await getAsetMaster();
        if (data && data.data) {
            jenisList.value = data.data.jenis || [];
        }
    } catch (e) {
        jenisList.value = [];
    }
});

function openPreview(idx) {
    if (form.value.gambar[idx]?.url) {
        previewSrc.value = form.value.gambar[idx].url
        showPreview.value = true
    }
}
function closePreview() {
    showPreview.value = false
}

function handleEdit() {
    router.push({ name: 'asetadd' })
}

function handleBack() {
    router.back()
}

function handleSuccessClose() {
    showSuccess.value = false
    router.push({ name: 'dashboard-wilayah' });
}

async function handleSubmit() {
    try {
        const fotos = [];
        if (form.value.gambar && Array.isArray(form.value.gambar)) {
            for (let i = 0; i < form.value.gambar.length; i++) {
                const img = form.value.gambar[i];
                if (img.url && img.file && img.file.name && img.file.type && img.url.startsWith('data:')) {
                    const res = await fetch(img.url);
                    const blob = await res.blob();
                    const file = new File([blob], img.file.name, { type: img.file.type });
                    fotos.push({ rawFile: file });
                }
            }
        }
        await postAset({ ...form.value, fotos });
        clearAsetFormData();
        showSuccess.value = true
    } catch (e) {
        alert(e?.response?.data?.message || e?.message || 'Gagal menyimpan data aset!');
        console.error(e?.response?.data || e);
    }
}
</script>