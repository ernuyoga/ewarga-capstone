<template>
  <div class="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
    <h2 class="text-2xl font-bold text-center mb-6 text-[#03BF8C]">Profil Warga</h2>
    <div class="flex flex-col items-center mb-6">
      <div class="relative">
        <img
          :src="form.foto ? form.foto : (form.foto_path ? getImageUrl(form.foto_path) : profileIcon)"
          alt="Foto Profil"
          class="w-28 h-28 rounded-full object-cover border-4 border-[#03BF8C] shadow"
        />
        <label v-if="isEdit" class="absolute bottom-0 right-0 bg-[#03BF8C] p-2 rounded-full cursor-pointer shadow-lg">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.94l-4.243 1.415 1.415-4.243a4 4 0 01.94-1.414z" />
          </svg>
          <input type="file" class="hidden" accept="image/*" @change="onFileChange" />
        </label>
      </div>
      <div v-if="isEdit" class="text-xs text-gray-400 mt-2">Klik ikon untuk ganti foto</div>
    </div>
    <form @submit.prevent="saveProfile" class="space-y-4">
      <div>
        <label class="block text-sm font-semibold mb-1">Nama Lengkap</label>
        <input type="text" v-model="form.nama" class="input" disabled />
      </div>
      <div>
        <label class="block text-sm font-semibold mb-1">NIK</label>
        <input type="text" v-model="form.nik" class="input" disabled />
      </div>
      <div>
        <label class="block text-sm font-semibold mb-1">Email</label>
        <input type="email" v-model="form.email" class="input" disabled />
      </div>
      <div>
        <label class="block text-sm font-semibold mb-1">Alamat</label>
        <input
          type="text"
          v-model="form.alamat"
          class="input"
          :disabled="!isEdit"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-semibold mb-1">No. HP</label>
        <input
          type="tel"
          v-model="form.no_hp"
          class="input"
          :disabled="!isEdit"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-semibold mb-1">Tanggal Lahir</label>
        <input type="date" v-model="form.tgl_lahir" class="input" disabled />
      </div>
      <div>
        <label class="block text-sm font-semibold mb-1">Jenis Kelamin</label>
        <input type="text" v-model="form.jk" class="input" disabled />
      </div>
      <div>
        <label class="block text-sm font-semibold mb-1">Status</label>
        <input type="text" v-model="form.status" class="input" disabled />
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button
          v-if="!isEdit"
          type="button"
          @click="isEdit = true"
          class="px-5 py-2 bg-[#03BF8C] text-white rounded-lg font-semibold hover:bg-[#029e71] transition"
        >
          Edit
        </button>
        <button
          v-if="isEdit"
          type="submit"
          class="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Simpan
        </button>
        <button
          v-if="isEdit"
          type="button"
          @click="cancelEdit"
          class="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
        >
          Batal
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { getWargaById } from '@/services/wargaService'
import { getImageUrl } from '@/lib/axios'
import profileIcon from '@/assets/icon_profile.svg'

const auth = useAuthStore()
const isEdit = ref(false)
const form = ref({
  nama: '',
  nik: '',
  email: '',
  alamat: '',
  no_hp: '',
  tgl_lahir: '',
  jk: '',
  status: '',
  foto: '',        // Untuk preview upload
  foto_path: '',   // Dari API
})
const backupForm = ref({})

onMounted(async () => {
  if (auth.user?.id) {
    const res = await getWargaById(auth.user.id)
    const data = res.data.data
    form.value = {
      nama: data.nama || '',
      nik: data.nik || '',
      email: data.email || data.user?.email || '',
      alamat: data.alamat || '',
      no_hp: data.no_tlp || '',
      tgl_lahir: data.tgl_lahir || '',
      jk: data.jenis_kelamin === 'L' ? 'Laki-laki' : (data.jenis_kelamin === 'P' ? 'Perempuan' : ''),
      status: data.status || 'Aktif',
      foto: '', // preview upload
      foto_path: data.foto_path || '',
    }
  }
})

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (evt) => {
      form.value.foto = evt.target.result
    }
    reader.readAsDataURL(file)
  }
}
function saveProfile() {
  // Simpan ke API/store di sini
  isEdit.value = false
}
function cancelEdit() {
  form.value = { ...backupForm.value }
  isEdit.value = false
}
watch(isEdit, (val) => {
  if (val) {
    backupForm.value = { ...form.value }
  }
})
</script>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03BF8C] bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400;
}
</style>