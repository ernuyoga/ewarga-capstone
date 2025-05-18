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
            <!-- Icon file -->
            <svg v-if="img.file.type === 'application/pdf'" class="w-5 h-5 text-gray-500 mr-2" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8.828A2 2 0 0019.414 7L15 2.586A2 2 0 0013.586 2H6z" />
            </svg>
            <svg v-else class="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 100 2 1 1 0 000-2zm4-4a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 100 2 1 1 0 000-2z" />
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
import { useRouter } from 'vue-router'
import { setUmkmFormData, getUmkmFormData } from '@/services/umkmService'

const router = useRouter()
const images = ref([])
const fileInput = ref(null);

const triggerFileInput = () => {
  if (images.value.length >= 5) return;
  fileInput.value.click();
};

const handleFiles = (e) => {
  const files = Array.from(e.target.files);
  for (const file of files) {
    if (
      (file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'application/pdf') &&
      file.size <= 1.5 * 1024 * 1024 &&
      images.value.length < 5
    ) {
      const url = file.type === 'application/pdf'
        ? ''
        : URL.createObjectURL(file);
      images.value.push({ file, url });
    }
  }
  setUmkmFormData({
    fotos: images.value.map(img => img.file.name)
  });
  e.target.value = '';
};

const removeImage = (idx) => {
  images.value.splice(idx, 1);
  setUmkmFormData({ gambar_count: images.value.length })
};

onMounted(() => {
  const formData = getUmkmFormData()
  const jumlah = formData.gambar_count || 0
  if (jumlah > 0 && images.value.length === 0) {
    for (let i = 0; i < jumlah; i++) {
      images.value.push({
        file: { name: `Foto ${i + 1}`, type: 'image/png' },
        url: ''
      })
    }
  }
});

const submitImages = async () => {
  setUmkmFormData({ gambar_count: images.value.length })
  router.push({ name: 'addumkm' });
};

const handleBack = () => {
  router.push({ name: 'addumkm' });
};
</script>