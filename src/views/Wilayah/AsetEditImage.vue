<template>
    <div class="min-h-screen bg-[#f6f6f6] pb-24">
        <!-- Header -->
        <HeaderForm title="Tambah Gambar Objek" @back="handleBack" />
        <Preview :show="showPreview" :src="previewSrc" @close="showPreview = false" />
        <PopupMessage :show="showWarning" title="Kesalahan Upload Gambar" :text="warningMsg" type="warning"
            @close="showWarning = false" />
            
        <!-- Info Box & Upload -->
        <div class="mx-4 md:mx-auto md:max-w-xl mt-4">
            <div class="bg-white rounded-xl p-4">
                <div class="bg-[#eaf4ff] rounded-xl px-4 py-3 flex items-start gap-2 mb-4">
                </div>
                <!-- Daftar Gambar -->
                <div v-if="images.length" class="space-y-2 mb-3">
                    <div v-for="(img, idx) in images" :key="idx"
                        class="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 mb-1">
                        <img v-if="img.id && img.file_path" :src="getImageUrl(img.file_path)" alt="gambar"
                            class="w-10 h-10 rounded-lg object-cover mr-2" @click="openPreview(img.url)" />
                        <img v-else-if="img.url" :src="img.url" alt="gambar"
                            class="w-10 h-10 rounded-lg object-cover mr-2" @click="openPreview(img.url)" />
                        <span class="flex-1 text-sm text-gray-800 truncate">
                            {{ img.file?.name || 'gambar aset' }}
                        </span>
                        <button @click="removeImage(idx)" class="ml-2 text-gray-400 hover:text-red-500 text-lg"
                            aria-label="Hapus">
                            &times;
                        </button>
                    </div>
                </div>

                <!-- Tombol tambah gambar -->
                <div class="flex justify-center mt-2">
                    <button @click="triggerFileInput"
                        class="flex items-center gap-2 text-[#00c48c] font-medium bg-transparent border-none py-2 px-4 rounded-lg hover:bg-[#e6faf5] transition text-base"
                        :disabled="images.length >= 5">
                        <span class="text-xl">+</span> Tambah Gambar
                    </button>
                    <input ref="fileInput" type="file" accept="image/png, image/jpeg" multiple style="display: none"
                        @change="handleFiles" />
                </div>
            </div>
        </div>

        <!-- Button -->
        <div class="fixed bottom-0 left-0 right-0 bg-transparent px-4 pb-4 z-10 md:max-w-xl md:mx-auto">
            <button
                class="w-full bg-[#00c48c] hover:bg-[#00b07b] text-white font-bold py-3 rounded-2xl text-base shadow transition"
                @click="submitImages">
                SIMPAN
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderForm from '@/components/card/HeaderForm.vue'
import { setAsetEditFormData, getAsetEditFormData } from '@/services/asetservice'
import { useRouter } from 'vue-router'
import { getImageUrl } from '@/lib/axios'
import Preview from '@/components/card/Preview.vue'
import PopupMessage from '@/components/shared/PopupMessage.vue'

const router = useRouter()
const images = ref([])
const fileInput = ref(null)
const showPreview = ref(false)
const previewSrc = ref('')
const showWarning = ref(false)
const warningMsg = ref('')

function openPreview(url) {
    previewSrc.value = url
    showPreview.value = true
}

const triggerFileInput = () => {
    if (images.value.length >= 5) return
    fileInput.value.click()
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => resolve(e.target.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

const handleFiles = async (e) => {
    const files = Array.from(e.target.files)
    for (const file of files) {
        if (images.value.length >= 5) {
            showWarning.value = true
            warningMsg.value = 'Maksimal 5 gambar'
            break
        }
        if (file.size > 1 * 1024 * 1024) {
            showWarning.value = true
            warningMsg.value = 'Ukuran file tidak boleh lebih dari 1MB'
            break
        }
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
            showWarning.value = true
            warningMsg.value = 'File harus berupa JPG atau PNG'
            break
        }
        const base64 = await fileToBase64(file)
        images.value.push({
            file: { name: file.name, type: file.type },
            url: base64,
            rawFile: file
        })
    }
    const oldData = getAsetEditFormData() || {};
    setAsetEditFormData({
        ...oldData,
        fotos: images.value
    });
    e.target.value = ''
}

const removeImage = (idx) => {
    const img = images.value[idx];
    images.value.splice(idx, 1);

    const oldData = getAsetEditFormData() || {};
    let hapusFoto = Array.isArray(oldData.hapus_foto) ? [...oldData.hapus_foto] : [];

    if (img.id) {
        hapusFoto.push(img.id);
    }

    setAsetEditFormData({
        ...oldData,
        fotos: images.value,
        hapus_foto: hapusFoto
    });
}

onMounted(async () => {
    const formData = getAsetEditFormData();
    let arr = []
    if (formData.fotos && Array.isArray(formData.fotos)) {
        arr = formData.fotos.map((img, idx) => ({
            ...img,
            file: {
                name: img.nama || img.file?.name || `Foto ${idx + 1}`,
                type: img.file?.type || 'image/png'
            },
            url: img.url || (img.file_path ? getImageUrl(img.file_path) : '')
        }))
    }
    images.value = arr
})

const submitImages = () => {
    const oldData = getAsetEditFormData() || {};
    setAsetEditFormData({
        ...oldData,
        fotos: images.value
    });
    router.back();
}

function handleBack() {
    router.back()
}
</script>