<template>
    <div class="min-h-screen bg-[#f6f6f6] pb-24">
        <!-- Header -->
        <HeaderForm title="Tambah Objek" @back="handleBack" />
        <Preview :show="showPreview" :src="previewSrc" @close="closePreview" />
        <PopupMessage :show="showSuccess" :text="`${form.nama || '-'} telah berhasil ditambahkan!`"
            title="Objek Berhasil ditambah!" type="success" @close="handleSuccessClose" />

        <!-- Stepper -->
        <div class="flex items-center gap-4 bg-white rounded-xl shadow px-6 py-4 mx-4 mt-4 md:mx-auto md:max-w-xl">
            <div
                class="w-14 h-14 rounded-full flex items-center justify-center bg-[#e6fff5] text-[#00c48c] text-xl font-bold">
                2/2
            </div>
            <div>
                <div class="text-base md:text-lg font-bold text-gray-800">Konfirmasi Data</div>
                <div class="text-xs md:text-sm text-gray-400">Selanjutnya : Tambahkan Data</div>
            </div>
        </div>

        <!-- Card Data -->
        <div class="bg-white rounded-xl shadow px-6 py-6 mx-4 mt-6 md:mx-auto md:max-w-xl">
            <div class="space-y-4">
                <div>
                    <div class="text-xs text-gray-400 mb-1">Nama Objek</div>
                    <div class="font-semibold text-gray-800">{{ form.nama || '-' }}</div>
                </div>
                <div>
                    <div class="text-xs text-gray-400 mb-1">Jenis Objek</div>
                    <div class="font-semibold text-gray-800">
                        {{
                            jenisList.find(j => j.id == form.jenis_id)?.nama || '-'
                        }}
                    </div>
                </div>
                <div>
                    <div class="text-xs text-gray-400 mb-1">Alamat Objek</div>
                    <div class="font-semibold text-gray-800 whitespace-pre-line">{{ form.alamat || '-' }}</div>
                </div>
                <div>
                    <div class="text-xs text-gray-400 mb-1">Pemilik Objek</div>
                    <div class="font-semibold text-gray-800">{{ form.pemilik || '-' }}</div>
                </div>
                <div>
                    <div class="text-xs text-gray-400 mb-1">Gambar Aset</div>
                    <div class="flex gap-3 mt-2 flex-wrap">
                        <template v-if="form.gambar && form.gambar.length">
                            <div v-for="(img, idx) in form.gambar" :key="idx"
                                class="w-16 h-16 rounded-lg bg-[#e6fff5] flex items-center justify-center cursor-pointer overflow-hidden"
                                @click="openPreview(idx)">
                                <img v-if="img.url" :src="img.url" alt="gambar aset"
                                    class="object-cover w-full h-full rounded-lg" />
                                <span v-else class="text-xs text-gray-400">gambar aset</span>
                            </div>
                        </template>
                        <template v-else>
                            <div
                                class="w-16 h-16 rounded-lg bg-[#e6fff5] flex items-center justify-center text-[#00c48c]">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16 10V6a4 4 0 10-8 0v4M12 14v2m0 0h.01" />
                                </svg>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <!-- Button -->
        <div class="fixed bottom-0 left-0 right-0 bg-transparent px-4 pb-4 z-10 flex gap-3 md:max-w-xl md:mx-auto">
            <button
                class="flex-1 border border-[#00c48c] text-[#00c48c] font-bold py-3 rounded-2xl text-base bg-white hover:bg-[#e6fff5] transition"
                @click="handleEdit">
                UBAH
            </button>
            <button
                class="flex-1 bg-[#00c48c] hover:bg-[#00b07b] text-white font-bold py-3 rounded-2xl text-base shadow transition"
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

const jenisList = ref([]);
const showPreview = ref(false)
const previewSrc = ref('')
const showSuccess = ref(false);

onMounted(async () => {
    const saved = getAsetFormData();
    Object.assign(form.value, saved);

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

const router = useRouter()
const form = ref({
    nama: '',
    jenis: '',
    alamat: '',
    pemilik: '',
    gambar: [],
})

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