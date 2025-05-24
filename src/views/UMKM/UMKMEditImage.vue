<template>
  <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
    <HeaderForm title="Tambah Gambar Usaha" @back="handleBack" />
    <Preview :show="showPreview" :src="previewSrc" @close="showPreview = false" />
    <PopupMessage :show="showWarning" title="Kesalahan Upload Gambar" :text="warningMsg" type="warning"
      @close="showWarning = false" />

    <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24 flex flex-col flex-1 justify-between">
      <div>
        <div class="bg-white rounded-xl mt-4 p-4 md:p-6">
          <InfoAlert>
            Gambar dapat ditambahkan dalam format JPG, JPEG, PNG, atau PDF, dengan ukuran maksimal 1,5 MB per file.
            Dapat menambahkan maksimal 5 gambar. Gambar yang ditambahkan pertama akan menjadi gambar profil usaha.
          </InfoAlert>

          <!-- Daftar file yang diupload -->
          <div v-for="(img, idx) in images" :key="idx"
            class="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-3 mb-3">
            <!-- Preview gambar lama dari file_path -->
            <img v-if="img.file_path" :src="`https://api.ewarga.rionaru.site/storage/${img.file_path}`"
              class="w-12 h-12 object-cover rounded mr-2" :alt="img.file.name"
              @click="openPreview(`https://api.ewarga.rionaru.site/storage/${img.file_path}`)" />
            <!-- Preview gambar baru dari base64 -->
            <img v-else-if="img.url && img.file.type !== 'application/pdf'" :src="img.url"
              class="w-12 h-12 object-cover rounded mr-2" :alt="img.file.name" @click="openPreview(img.url)" />
            <!-- Icon file PDF -->
            <svg v-if="img.file.type === 'application/pdf'" class="w-5 h-5 text-gray-500 mr-2" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8.828A2 2 0 0019.414 7L15 2.586A2 2 0 0013.586 2H6z" />
            </svg>
            <!-- Nama file -->
            <span class="flex-1 text-sm md:text-base text-gray-800 truncate">
              {{ img.file.name ? img.file.name : `Foto ${idx + 1}` }}
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
        <SubmitButton @submit="submitImages" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { setEditUmkmFormData, getEditUmkmFormData } from '@/services/umkmService'
import HeaderForm from '../../components/card/HeaderForm.vue';
import SubmitButton from '../../components/card/SubmitButton.vue';
import InfoAlert from '@/components/card/InfoAlert.vue'
import Preview from '@/components/card/Preview.vue'
import PopupMessage from '@/components/shared/PopupMessage.vue'

const router = useRouter()
const route = useRoute()
const images = ref([])
const fileInput = ref(null);
const showPreview = ref(false)
const previewSrc = ref('')
const showWarning = ref(false)
const warningMsg = ref('')
const hapusFoto = ref([])

function openPreview(url) {
  previewSrc.value = url;
  showPreview.value = true;
}

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
    const base64 = await fileToBase64(file);
    images.value.push({ file: { name: file.name, type: file.type }, url: base64 });
  }
  setEditUmkmFormData({ gambar: images.value })
  e.target.value = '';
};

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