<template>
  <div class="min-h-screen bg-[#f6f6f6] pb-24">
    <!-- Header -->
    <HeaderForm title="Tambah Gambar Objek" @back="handleBack" />

    <!-- Info Box & Upload -->
    <div class="mx-4 md:mx-auto md:max-w-xl mt-4">
      <div class="bg-white rounded-xl p-4">
        <div class="bg-[#eaf4ff] rounded-xl px-4 py-3 flex items-start gap-2 mb-4">
          <svg class="w-5 h-5 mt-1 text-[#2e5eaa]" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01" />
          </svg>
          <span class="text-sm text-[#2e5eaa] leading-snug">
            Gambar dapat ditambahkan dalam format JPG, JPEG, PNG, dengan ukuran maksimal 1,5 MB per file.
            Dapat menambahkan maksimal 5 gambar. Gambar yang ditambahkan pertama akan menjadi gambar profil objek.
          </span>
        </div>

        <!-- Daftar Gambar -->
        <div v-if="images.length" class="space-y-2 mb-3">
          <div v-for="(img, idx) in images" :key="idx"
            class="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 mb-1">
            <img v-if="img.url" :src="img.url" alt="gambar" class="w-10 h-10 rounded-lg object-cover mr-2" />
            <span class="flex-1 text-sm text-gray-800 truncate">
              {{ img.file?.name || 'gambar aset' }}
            </span>
            <button @click="removeImage(idx)" class="ml-2 text-gray-400 hover:text-red-500 text-lg" aria-label="Hapus">
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
import { setAsetFormData, getAsetFormData } from '@/services/asetservice'
import { useRouter } from 'vue-router'

const router = useRouter()
const images = ref([])
const fileInput = ref(null)

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
    if (
      (file.type === 'image/jpeg' ||
        file.type === 'image/png') &&
      file.size <= 1.5 * 1024 * 1024 &&
      images.value.length < 5
    ) {
      const base64 = await fileToBase64(file)
      images.value.push({
        file: { name: file.name, type: file.type },
        url: base64,
        rawFile: file
      })
    }
  }
  setAsetFormData({ fotos: images.value })
  e.target.value = ''
}

const removeImage = (idx) => {
  images.value.splice(idx, 1)
  setAsetFormData({ gambar: images.value })
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
  setAsetFormData({ gambar: images.value })
  router.back()
}

function handleBack() {
  router.back()
}
</script>