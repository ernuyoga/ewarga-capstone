<template>
    <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
        <HeaderForm title="Tambah Gambar Produk" @back="handleBack" />
        <Preview :show="showPreview" :src="previewSrc" @close="showPreview = false" />
        <PopupMessage :show="showWarning" title="Kesalahan Upload Gambar" :text="warningMsg" type="warning"
            @close="showWarning = false" />

        <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24 flex flex-col flex-1 justify-between">
            <div>
                <div class="bg-white rounded-xl mt-4 p-4 md:p-6">
                    <!-- Info Alert -->
                    <InfoAlert>
                        Gambar dapat ditambahkan dalam format JPG, JPEG, dan PNG, dengan ukuran maksimal 1,5 MB per
                        file.
                        Dapat menambahkan maksimal 5 gambar. Gambar yang ditambahkan pertama akan menjadi gambar profil
                        produk.
                    </InfoAlert>

                    <!-- Daftar file yang diupload -->
                    <div v-for="(img, idx) in images" :key="idx"
                        class="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-3 mb-3">
                        <!-- Preview gambar -->
                        <img v-if="img.url && img.file.type !== 'application/pdf'" :src="img.url"
                            class="w-12 h-12 object-cover rounded mr-2" :alt="img.file.name"
                            @click="openPreview(img.url)" />
                        <svg v-else class="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 100 2 1 1 0 000-2zm4-4a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 100 2 1 1 0 000-2z" />
                        </svg>
                        <!-- Nama file -->
                        <span class="flex-1 text-sm md:text-base text-gray-800 truncate">
                            {{ img.file.name ? img.file.name : `Foto ${idx + 1}` }}
                        </span>
                        <!-- Tombol hapus -->
                        <button @click="removeImage(idx)"
                            class="ml-2 text-gray-400 hover:text-red-500 text-lg md:text-xl" aria-label="Hapus">
                            &times;
                        </button>
                    </div>

                    <!-- Tombol tambah gambar -->
                    <div class="flex justify-center mt-2">
                        <button @click="triggerFileInput"
                            class="flex items-center gap-2 text-[#03BF8C] font-medium bg-transparent border-none p-1 rounded-lg transition text-base md:text-lg"
                            :disabled="images.length >= 5">
                            <span class="text-xl md:text-2xl">+</span> Tambah Gambar
                        </button>
                        <input ref="fileInput" type="file" accept="image/png, image/jpeg" multiple style="display: none"
                            @change="handleFiles" />
                    </div>
                </div>
            </div>
            <div class="mt-4 mb-4">
                <button @click="submitImages"
                    class="w-full bg-[#03BF8C] text-white font-semibold py-3 rounded-full text-center text-base lg:text-lg hover:bg-[#029e71] transition-all">
                    SIMPAN
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderForm from '@/components/card/HeaderForm.vue'
import InfoAlert from '@/components/card/InfoAlert.vue'
import Preview from '@/components/card/Preview.vue'
import PopupMessage from '@/components/shared/PopupMessage.vue'
import { useRouter } from 'vue-router'
import { setProdukFormData, getProdukFormData } from '@/services/produkService'

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
        images.value.push({ file: { name: file.name, type: file.type }, url: base64 })

    }
    setProdukFormData({
        fotos: images.value
    })
    e.target.value = ''
}

const removeImage = (idx) => {
    images.value.splice(idx, 1)
    setProdukFormData({ fotos: images.value })
}

onMounted(() => {
    const formData = getProdukFormData()
    if (formData.fotos && Array.isArray(formData.fotos)) {
        images.value = [...formData.fotos]
    }
})

const submitImages = () => {
    setProdukFormData({ gambar_count: images.value.length })
    router.push({ name: 'addproduk' })
}

const handleBack = () => {
    router.push({ name: 'addproduk' })
}
</script>