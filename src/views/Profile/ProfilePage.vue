<template>
  <div class="min-h-screen bg-[#f6f6f6]">
    <HeaderForm :title="'Profil Warga'" @back="goBack">
      <template #action>
        <div class="inline-block relative">
          <button @click="toggleMenu">
            <img src="@/assets/titik_tiga.png" alt="Menu" class="w-6 h-6 mt-1" />
          </button>
          <div v-if="showMenu" class="absolute right-0 mt-2 z-50 bg-white rounded-b-xl shadow-lg py-2 w-40">
            <button class="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100"
              @click="showLogoutModal = true; closeMenu()">
              <img src="@/assets/logout_merah.svg" alt="Logout" class="w-5 h-5 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </template>
    </HeaderForm>

    <!-- Modal Konfirmasi Logout -->
    <ModalKonfirmasi :show="showLogoutModal" @cancel="showLogoutModal = false" @confirm="handleLogout">
      
      <div class="text-center">
        Apakah Anda yakin ingin logout?
      </div>
    </ModalKonfirmasi>

    <Preview :show="showPreview" :src="previewSrc" @close="showPreview = false" />
    <PopupMessage :show="showSuccess" type="success" title="Profile berhasil diperbarui" :text="changedFields"
      listLabel="Data yang diperbarui:" @close="showSuccess = false" />

    <div class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 my-4 p-4 md:p-6">
      <div class="flex flex-col items-center mb-6">
        <div class="relative">
          <img :src="form.foto ? form.foto : (form.foto_path ? getImageUrl(form.foto_path) : profileIcon)"
            @click="openPreview" alt="Foto Profil"
            class="w-32 h-32 rounded-full object-cover border-2 border-[#03BF8C] shadow" />
          <label class="absolute bottom-0 right-0 bg-[#03BF8C] p-2 rounded-full cursor-pointer shadow-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.94l-4.243 1.415 1.415-4.243a4 4 0 01.94-1.414z" />
            </svg>
            <input type="file" class="hidden" accept="image/*" @change="onFileChange" />
          </label>
        </div>
        <div class="text-xs text-gray-400 mt-2">Klik ikon untuk ganti foto</div>
      </div>
      <form @submit.prevent="saveProfile" class="flex flex-col gap-3">
        <div class="relative">
          <label class="block text-sm font-medium text-[#232360] mb-1">Nama Lengkap</label>
          <input type="text" v-model="form.nama" maxlength="255"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50 pr-10"
            required />
          <img src="@/assets/edit_tua.svg" alt="edit"
            class="absolute right-3 top-9 lg:top-10 w-4 h-4 opacity-70 pointer-events-none" />
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-[#232360] mb-1">NIK</label>
          <input type="text" v-model="form.nik" maxlength="16"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50 pr-10"
            required />
          <img src="@/assets/edit_tua.svg" alt="edit"
            class="absolute right-3 top-9 lg:top-10 w-4 h-4 opacity-70 pointer-events-none" />
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-[#232360] mb-1">No. KK</label>
          <input type="text" v-model="form.no_kk" maxlength="16"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50 pr-10" />
          <img src="@/assets/edit_tua.svg" alt="edit"
            class="absolute right-3 top-9 lg:top-10 w-4 h-4 opacity-70 pointer-events-none" />
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-[#232360] mb-1">No. HP</label>
          <input type="tel" v-model="form.no_tlp" maxlength="13"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50 pr-10" />
          <img src="@/assets/edit_tua.svg" alt="edit"
            class="absolute right-3 top-9 lg:top-10 w-4 h-4 opacity-70 pointer-events-none" />
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-[#232360] mb-1">Tempat Lahir</label>
          <input type="text" v-model="form.tempat_lahir" maxlength="60"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50 pr-10" />
          <img src="@/assets/edit_tua.svg" alt="edit"
            class="absolute right-3 top-9 lg:top-10 w-4 h-4 opacity-70 pointer-events-none" />
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-[#232360] mb-1">Tanggal Lahir</label>
          <input type="date" v-model="form.tgl_lahir"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50" />
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-[#232360] mb-1">Jenis Kelamin</label>
          <select v-model="form.jenis_kelamin"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base appearance-none focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50 pr-10">
            <option disabled value="">Pilih</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          <img src="@/assets/v_hitam.svg" alt="dropdown"
            class="pointer-events-none absolute right-3 top-9 lg:top-10 w-4 h-4 opacity-70" />
        </div>
        <div class="relative">
          <label class="block text-sm font-medium text-[#232360] mb-1">Alamat</label>
          <input type="text" v-model="form.alamat" maxlength="255"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50 pr-10" />
          <img src="@/assets/edit_tua.svg" alt="edit"
            class="absolute right-3 top-9 lg:top-10 w-4 h-4 opacity-70 pointer-events-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-[#232360] mb-1">Email</label>
          <input type="email" v-model="form.email"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base bg-gray-100 text-gray-400 cursor-not-allowed"
            disabled />
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button type="submit"
            class="px-5 py-2 bg-[#03BF8C] text-white rounded-full font-semibold hover:bg-[#029e73] transition">
            Simpan
          </button>
          <button type="button" @click="cancelEdit"
            class="px-5 py-2 bg-white border border-[#03BF8C] text-[#03BF8C] rounded-full font-semibold hover:bg-[#e6faf5] transition">
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { getWargaById, updateWargaForm } from '@/services/wargaService'
import { getImageUrl } from '@/lib/axios'
import profileIcon from '@/assets/icon_profile.svg'
import HeaderForm from '@/components/card/HeaderForm.vue'
import Preview from '@/components/card/Preview.vue'
import PopupMessage from '@/components/shared/PopupMessage.vue'
import ModalKonfirmasi from '@/components/shared/ModalKonfirmasi.vue'

const auth = useAuthStore()
const router = useRouter()
const showPreview = ref(false);
const previewSrc = ref('');
const backupForm = ref({})
const showSuccess = ref(false)
const changedFields = ref([])
const showMenu = ref(false)
const showLogoutModal = ref(false)
const form = ref({
  nama: '',
  nik: '',
  no_kk: '',
  no_tlp: '',
  tempat_lahir: '',
  tgl_lahir: '',
  jenis_kelamin: '',
  alamat: '',
  email: '',
  foto: '',
  foto_path: '',
})

async function refreshWarga() {
  if (auth.user?.id) {
    const res = await getWargaById(auth.user.id)
    const data = res.data.data
    form.value = {
      nama: data.nama || '',
      nik: data.nik || '',
      no_kk: data.no_kk || '',
      no_tlp: data.no_tlp || '',
      tempat_lahir: data.tempat_lahir || '',
      tgl_lahir: data.tgl_lahir || '',
      jenis_kelamin: data.jenis_kelamin || '',
      alamat: data.alamat || '',
      email: data.email || data.user?.email || '',
      foto: '',
      foto_path: data.foto_path || '',
    }
    backupForm.value = { ...form.value }
  }
}

onMounted(refreshWarga)

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

function openPreview() {
  if (form.value.foto) {
    previewSrc.value = form.value.foto;
  } else if (form.value.foto_path) {
    const url = getImageUrl(form.value.foto_path);
    previewSrc.value = url;
  } else {
    previewSrc.value = profileIcon;
  }
  showPreview.value = true;
}

async function saveProfile() {
  let fotoFile = null;
  if (form.value.foto) {
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput && fileInput.files[0]) {
      fotoFile = fileInput.files[0];
    }
  }
  const changed = []
  for (const key in form.value) {
    if (form.value[key] !== backupForm.value[key]) {
      // Label yang lebih ramah
      switch (key) {
        case 'nama': changed.push('Nama Lengkap'); break;
        case 'nik': changed.push('NIK'); break;
        case 'no_kk': changed.push('No. KK'); break;
        case 'no_tlp': changed.push('No. HP'); break;
        case 'tempat_lahir': changed.push('Tempat Lahir'); break;
        case 'tgl_lahir': changed.push('Tanggal Lahir'); break;
        case 'jenis_kelamin': changed.push('Jenis Kelamin'); break;
        case 'alamat': changed.push('Alamat'); break;
        case 'foto': changed.push('Foto Profil'); break;
      }
    }
  }
  try {
    await updateWargaForm(auth.user.id, {
      nama: form.value.nama,
      nik: form.value.nik,
      no_kk: form.value.no_kk,
      no_tlp: form.value.no_tlp,
      tempat_lahir: form.value.tempat_lahir,
      tgl_lahir: form.value.tgl_lahir,
      jenis_kelamin: form.value.jenis_kelamin,
      alamat: form.value.alamat,
      foto: fotoFile
    });
    await refreshWarga();
    changedFields.value = changed.length ? changed : ['Tidak ada perubahan'];
    showSuccess.value = true;
  } catch (err) {
    let msg = 'Gagal update profil';
    alert(msg);
  }
}

function cancelEdit() {
  form.value = { ...backupForm.value }
}

function goBack() {
  router.back()
}

function closeMenu() {
  showMenu.value = false
}
function toggleMenu(e) {
  e?.stopPropagation?.()
  showMenu.value = !showMenu.value
}
onMounted(() => {
  document.addEventListener('click', closeMenu)
})
onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>