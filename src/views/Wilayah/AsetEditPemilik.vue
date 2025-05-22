<template>
  <div class="min-h-screen bg-[#f6f6f6] pb-24">
    <!-- Header -->
    <HeaderForm title="Tambah Pemilik Aset" @back="handleBack" />

    <!-- Search -->
    <div class="mx-4 md:mx-auto md:max-w-xl mt-4">
      <div class="relative">
        <input v-model="search" type="text" placeholder="Cari Nama ..."
          class="w-full border border-gray-200 rounded-lg px-4 py-3 bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#00c48c] text-sm pr-10" />
        <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
          stroke-width="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-2-2" />
        </svg>
      </div>
    </div>

    <!-- Daftar Warga -->
    <div class="mx-4 md:mx-auto md:max-w-xl mt-4">
      <div class="text-sm text-gray-500 mb-2">Daftar Warga</div>
      <div class="bg-white rounded-xl shadow px-2 py-2">
        <template v-if="filteredWarga.length">
          <div v-for="warga in filteredWarga" :key="warga.id"
            class="flex items-center px-2 py-2 hover:bg-[#f6f6f6] rounded-lg transition">
            <img :src="warga.foto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(warga.nama)" alt="foto"
              class="w-10 h-10 rounded-full object-cover mr-3" />
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-800 truncate">{{ warga.nama }}</div>
              <div class="text-xs text-gray-500 truncate">{{ warga.no_hp }}</div>
            </div>
            <input type="radio" :value="warga" v-model="selectedWarga" class="form-radio text-[#00c48c] w-5 h-5" />
          </div>
        </template>
        <template v-else>
          <div class="text-center text-gray-400 py-6">Tidak ada warga ditemukan</div>
        </template>
      </div>
    </div>

    <!-- Button -->
    <div class="fixed bottom-0 left-0 right-0 bg-transparent px-4 pb-4 z-10 md:max-w-xl md:mx-auto">
      <button
        class="w-full bg-[#00c48c] hover:bg-[#00b07b] text-white font-bold py-3 rounded-2xl text-base shadow transition"
        :disabled="!selectedWarga" @click="submitPemilik">
        SIMPAN
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeaderForm from '@/components/card/HeaderForm.vue'
import { getAllWarga } from '@/services/wargaService'
import { setAsetEditFormData, getAsetEditFormData } from '@/services/asetservice'
import { useRouter } from 'vue-router'

const router = useRouter()
const search = ref('')
const wargaList = ref([])
const selectedWarga = ref(null)

const filteredWarga = computed(() => {
  if (!search.value) return wargaList.value
  return wargaList.value.filter(w =>
    w.nama.toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(async () => {
  try {
    const res = await getAllWarga()
    wargaList.value = res.data.data || []
    // Jika sudah ada pemilik di localStorage, set radio-nya
    const asetForm = getAsetEditFormData()
    if (asetForm.pemilik_id) {
      selectedWarga.value = wargaList.value.find(w => w.id === asetForm.pemilik_id)
    }
  } catch (e) {
    wargaList.value = []
  }
})

function submitPemilik() {
  if (!selectedWarga.value) return
  const oldData = getAsetEditFormData() || {};
  setAsetEditFormData({
    ...oldData,
    pemilik: selectedWarga.value.nama,
    pemilik_id: selectedWarga.value.id
  })
  router.back()
}

function handleBack() {
  router.back()
}
</script>