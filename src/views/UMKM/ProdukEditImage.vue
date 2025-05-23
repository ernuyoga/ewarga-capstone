<template>
  <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
    <HeaderForm title="Ubah Gambar Produk" @back="handleBack" />

    <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24 flex flex-col flex-1 justify-between">
      <div>
        <div class="bg-white rounded-xl mt-4 p-4 md:p-6">
          <!-- Info Alert -->
          <InfoAlert>
            Gambar dapat ditambahkan dalam format JPG, JPEG, PNG, atau PDF, dengan ukuran maksimal 1,5 MB per file.
            Maksimal 5 gambar. Gambar pertama akan menjadi gambar utama produk.
          </InfoAlert>

          <!-- Daftar file yang diupload -->
          <div v-for="(img, idx) in images" :key="idx"
            class="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-3 mb-3">
            <!-- Preview gambar lama dari file_path -->
            <img v-if="img.file_path" :src="getImageUrl(img.file_path)" class="w-12 h-12 object-cover rounded mr-2"
              :alt="img.file?.name || img.nama" />
            <!-- Preview gambar baru dari base64 -->
            <img v-else-if="img.url && img.file.type !== 'application/pdf'" :src="img.url"
              class="w-12 h-12 object-cover rounded mr-2" :alt="img.file.name" />
            <!-- Icon file PDF -->
            <svg v-if="img.file.type === 'application/pdf'" class="w-5 h-5 text-gray-500 mr-2" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8.828A2 2 0 0019.414 7L15 2.586A2 2 0 0013.586 2H6z" />
            </svg>
            <!-- Nama file -->
            <span class="flex-1 text-sm md:text-base text-gray-800 truncate">
              {{ img.file?.name ? img.file.name : img.nama || `Foto ${idx + 1}` }}
            </span>
            <!-- Tombol hapus -->
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
            <input ref="fileInput" type="file" accept="image/png, image/jpeg, application/pdf" multiple
              style="display: none" @change="handleFiles" />
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
import { ref, onMounted } from 'vue';
import HeaderForm from '@/components/card/HeaderForm.vue';
import InfoAlert from '@/components/card/InfoAlert.vue';
import { useRouter, useRoute } from 'vue-router'
import { setEditProdukFormData, getEditProdukFormData } from '@/services/produkService'
import { getImageUrl } from '@/lib/axios'

const router = useRouter()
const route = useRoute()
const images = ref([])
const fileInput = ref(null)
const hapusFoto = ref([])

const triggerFileInput = () => {
  if (images.value.length >= 5) return;
  fileInput.value.click();
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const handleFiles = async (e) => {
  const files = Array.from(e.target.files);
  for (const file of files) {
    if (
      (file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'application/pdf') &&
      file.size <= 1.5 * 1024 * 1024 &&
      images.value.length < 5
    ) {
      let imgObj = { file: { name: file.name, type: file.type } };
      if (file.type !== 'application/pdf') {
        imgObj.url = await fileToBase64(file);
      }
      images.value.push(imgObj);
    }
  }
  setEditProdukFormData({ fotos: images.value })
  e.target.value = '';
};

const removeImage = (idx) => {
  const img = images.value[idx]
  if (img.id) {
    hapusFoto.value.push(img.id)
  }
  images.value.splice(idx, 1)
  setEditProdukFormData({
    fotos: images.value,
    hapus_foto: hapusFoto.value
  })
}

onMounted(() => {
  const formData = getEditProdukFormData()
  if (formData.fotos && Array.isArray(formData.fotos)) {
    images.value = formData.fotos.map((img, idx) => ({
      id: img.id,
      file: {
        name: img.file?.name || img.nama || `Foto ${idx + 1}`,
        type: img.file?.type || 'image/png'
      },
      file_path: img.file_path,
      url: img.url || '' // hanya untuk gambar baru
    }))
  }
  hapusFoto.value = formData.hapus_foto || []
})

const submitImages = async () => {
  setEditProdukFormData({
    fotos: images.value,
    hapus_foto: hapusFoto.value
  })
  router.push({ name: 'produkedit', params: { id: route.params.id } })
}

const handleBack = () => {
  router.back()
};
</script>