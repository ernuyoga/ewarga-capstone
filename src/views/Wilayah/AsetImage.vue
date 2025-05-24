<template>
  <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
    <HeaderForm title="Tambah Gambar Objek" @back="handleBack" />
    <Preview :show="showPreview" :src="previewSrc" @close="showPreview = false" />
    <PopupMessage :show="showWarning" title="Kesalahan Upload Gambar" :text="warningMsg" type="warning"
      @close="showWarning = false" />

    <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24 flex flex-col flex-1 justify-between">
      <div>
        <div class="bg-white rounded-xl mt-4 p-4 md:p-6">
          <InfoAlert>
            Gambar dapat ditambahkan dalam format JPG, JPEG, dan PNG, dengan ukuran maksimal 1,5 MB per file.
            Dapat menambahkan maksimal 5 gambar. Gambar yang ditambahkan pertama akan menjadi gambar profil objek.
          </InfoAlert>

          <!-- Daftar file yang diupload -->
          <div v-for="(img, idx) in images" :key="idx"
            class="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-3 mb-3">
            <img v-if="img.url" :src="img.url" class="w-12 h-12 object-cover rounded mr-2"
              :alt="img.file?.name || `Foto ${idx + 1}`" @click="openPreview(img.url)" />
            <span class="flex-1 text-sm md:text-base text-gray-800 truncate">
              {{ img.file?.name ? img.file.name : `Foto ${idx + 1}` }}
            </span>
            <button @click="removeImage(idx)" class="ml-2 text-gray-400 hover:text-red-500 text-lg md:text-xl"
              aria-label="Hapus">
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
        <button
          class="w-full bg-[#00c48c] hover:bg-[#00b07b] text-white font-bold py-3 rounded-2xl text-base shadow transition"
          @click="submitImages">
          SIMPAN
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { setAsetFormData, getAsetFormData } from '@/services/asetservice'
import { useRouter } from 'vue-router'
import HeaderForm from '@/components/card/HeaderForm.vue'
import Preview from '@/components/card/Preview.vue'
import PopupMessage from '@/components/shared/PopupMessage.vue'
import InfoAlert from '@/components/card/InfoAlert.vue'

const router = useRouter()
const images = ref([])
const fileInput = ref(null)
const showPreview = ref(false);
const previewSrc = ref('');
const showWarning = ref(false)
const warningMsg = ref('')

function openPreview(url) {
  previewSrc.value = url;
  showPreview.value = true;
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
    if (file.size > 1.5 * 1024 * 1024) {
      showWarning.value = true
      warningMsg.value = 'Ukuran file tidak boleh lebih dari 1,5MB'
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
  setAsetFormData({ fotos: images.value })
  e.target.value = ''
}

const removeImage = (idx) => {
  images.value.splice(idx, 1)
  setAsetFormData({ fotos: images.value })
}

onMounted(() => {
  const formData = getAsetFormData()
  if (formData.fotos && Array.isArray(formData.fotos)) {
    images.value = formData.fotos
  } else {
    images.value = []
  }
})

const submitImages = () => {
  setAsetFormData({ fotos: images.value })
  router.back()
}

function handleBack() {
  router.back()
}
</script>