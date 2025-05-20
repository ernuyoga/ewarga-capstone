<template>
  <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
    <HeaderForm title="Tambah Gambar Umkm" @back="handleBack" />

    <div class="flex flex-col flex-1 justify-between">
      <div>
        <div class="bg-white rounded-xl mx-4 mt-4 p-4">
          <div class="bg-[#eaf4ff] rounded-xl px-4 py-3 flex items-start gap-2 mb-4">
            <img src="/Info-Circle.svg" alt="info" class="w-5 h-5 mt-1" />
            <span class="text-sm text-[#2e5eaa] leading-snug">
              Gambar dapat ditambahkan dalam format JPG, JPEG, PNG, atau PDF, dengan ukuran maksimal 1,5 MB per file.
              Dapat menambahkan maksimal 5 gambar. Gambar yang ditambahkan pertama akan menjadi gambar profil usaha.
            </span>
          </div>

          <!-- Daftar file yang diupload -->
          <div v-for="(img, idx) in images" :key="idx"
            class="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 mb-3">
            <!-- Preview gambar lama dari file_path -->
            <img v-if="img.file_path" :src="`https://api.ewarga.rionaru.site/storage/${img.file_path}`"
              class="w-12 h-12 object-cover rounded mr-2" :alt="img.file.name" />
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
            <span class="flex-1 text-sm text-gray-800 truncate">
              {{ img.file.name ? img.file.name : `Foto ${idx + 1}` }}
            </span>
            <!-- Tombol hapus -->
            <button @click="removeImage(idx)" class="ml-2 text-gray-400 hover:text-red-500 text-lg" aria-label="Hapus">
              &times;
            </button>
          </div>

          <!-- Tombol tambah gambar -->
          <div class="flex justify-center mt-2">
            <button @click="triggerFileInput"
              class="flex items-center gap-2 text-[#00c48c] font-medium bg-transparent border-none py-2 px-4 rounded-lg hover:bg-[#e6faf5] transition"
              :disabled="images.length >= 5">
              <span class="text-xl">+</span> Tambah Gambar
            </button>
            <input ref="fileInput" type="file" accept="image/png, image/jpeg, application/pdf" multiple
              style="display: none" @change="handleFiles" />
          </div>
        </div>
      </div>
      <SubmitButton @submit="submitImages" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HeaderForm from '../../components/card/HeaderForm.vue';
import SubmitButton from '../../components/card/SubmitButton.vue';
import { useRouter, useRoute } from 'vue-router'
import { setEditUmkmFormData, getEditUmkmFormData } from '@/services/umkmService'

const router = useRouter()
const route = useRoute()
const images = ref([])
const fileInput = ref(null);

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
        file.type === 'image/png') &&
      file.size <= 1.5 * 1024 * 1024 &&
      images.value.length < 5
    ) {
      const base64 = await fileToBase64(file);
      images.value.push({ file: { name: file.name, type: file.type }, url: base64 });
    }
  }
  setEditUmkmFormData({ gambar: images.value })
  e.target.value = '';
};

const hapusFoto = ref([])

const removeImage = (idx) => {
  const img = images.value[idx]
  if (img.id) {
    hapusFoto.value.push(img.id)
  }
  images.value.splice(idx, 1)
  setEditUmkmFormData({
    gambar: images.value,
    hapus_foto: hapusFoto.value
  })
}

onMounted(() => {
  const formData = getEditUmkmFormData()
  if (formData.gambar && Array.isArray(formData.gambar)) {
    images.value = formData.gambar.map((img, idx) => ({
      id: img.id,
      file: {
        name: img.file?.name || img.nama || `Foto ${idx + 1}`,
        type: img.file?.type || 'image/png'
      },
      file_path: img.file_path,
      url: img.url || '' // hanya untuk gambar baru
    }))
  }
})

const submitImages = async () => {
  setEditUmkmFormData({
    gambar: images.value,
    hapus_foto: hapusFoto.value
  })
  router.push({ name: 'umkmedit', params: { id: route.params.id } })
}

const handleBack = () => {
  router.back()
};
</script>