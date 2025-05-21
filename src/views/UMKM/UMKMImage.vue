<template>
  <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
    <HeaderForm title="Tambah Gambar Umkm" @back="handleBack" />

    <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24 flex flex-col flex-1 justify-between">
      <div>
        <div class="bg-white rounded-xl mt-4 p-4 md:p-6">
          <div class="bg-[#eaf4ff] rounded-xl px-4 py-3 flex items-start gap-2 mb-4">
            <img src="/Info-Circle.svg" alt="info" class="w-5 h-5 mt-1" />
            <span class="text-sm md:text-base text-[#2e5eaa] leading-snug">
              Gambar dapat ditambahkan dalam format JPG, JPEG, PNG, atau PDF, dengan ukuran maksimal 1,5 MB per file.
              Dapat menambahkan maksimal 5 gambar. Gambar yang ditambahkan pertama akan menjadi gambar profil usaha.
            </span>
          </div>

          <!-- Daftar file yang diupload -->
          <div v-for="(img, idx) in images" :key="idx"
            class="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-3 mb-3">
            <!-- Icon file -->
            <img v-if="img.url && img.file.type !== 'application/pdf'" :src="img.url"
              class="w-12 h-12 object-cover rounded mr-2" :alt="img.file.name" />
            <svg v-else class="w-5 h-5 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 100 2 1 1 0 000-2zm4-4a1 1 0 100 2 1 1 0 000-2zm0 4a1 1 0 100 2 1 1 0 000-2z" />
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
              class="flex items-center gap-2 text-[#00c48c] font-medium bg-transparent border-none py-2 md:py-3 px-4 md:px-6 rounded-lg hover:bg-[#e6faf5] transition text-base md:text-lg"
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
  setUmkmFormData({
    fotos: images.value
  });
  e.target.value = '';
};

const removeImage = (idx) => {
  images.value.splice(idx, 1);
  setUmkmFormData({ fotos: images.value });
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