<template>
  <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
    <HeaderForm title="Tambah Pemilik Aset" @back="handleBack" />

    <div class="flex-1 flex flex-col">
      <div class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6">
        <div class="relative mb-3">
          <InfoAlert>
            Setiap aset hanya dapat dimiliki oleh satu orang. Pemilik aset harus merupakan warga yang sudah terdaftar di
            aplikasi.
          </InfoAlert>
          <div class="relative">
            <input v-model="search" type="text"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-3 pr-10 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C]"
              placeholder="Cari Nama..." />
            <img src="@/assets/search_icon.svg" alt="Search"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 pointer-events-none" />
          </div>
        </div>
        <div class="font-semibold text-[#232360] mt-6 mb-2 text-base md:text-lg">Daftar Warga</div>
        <div class="flex flex-col gap-2 max-h-[420px] overflow-y-auto">
          <template v-if="filteredWarga.length">
            <div v-for="warga in filteredWarga" :key="warga.id"
              class="flex items-center px-2 md:px-4 py-2 md:py-3 rounded-lg hover:bg-[#f5f5f5] transition cursor-pointer select-none"
              @click="selectWarga(warga)">
              <img :src="warga.foto_path ? getImageUrl(warga.foto_path) : profileDefault" alt="foto"
                class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mr-3 border" />
              <div class="flex-1">
                <div class="font-medium text-[#232360] text-sm md:text-base">{{ warga.nama }}</div>
                <div class="text-xs md:text-sm text-[#2e5eaa]">{{ warga.no_hp }}</div>
              </div>
              <label class="inline-flex items-center">
                <input type="radio" class="hidden" :checked="selectedWarga && selectedWarga.id === warga.id"
                  tabindex="-1" readonly />
                <div class="w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-300 flex items-center justify-center"
                  :class="selectedWarga && selectedWarga.id === warga.id ? 'bg-[#03BF8C]' : 'bg-white'">
                  <svg v-if="selectedWarga && selectedWarga.id === warga.id" class="w-3 h-3 md:w-4 md:h-4 text-white"
                    fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="currentColor" />
                  </svg>
                </div>
              </label>
            </div>
          </template>
          <template v-else>
            <div class="text-center text-gray-400 py-6">Tidak ada warga ditemukan</div>
          </template>
        </div>
      </div>
      <div class="mt-auto mb-4 mx-4 md:mx-8 lg:mx-16 xl:mx-24">
        <button
          class="w-full bg-[#00c48c] hover:bg-[#00b07b] text-white font-bold py-3 rounded-2xl text-base shadow transition"
          :disabled="!selectedWarga" @click="submitPemilik">
          SIMPAN
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeaderForm from '@/components/card/HeaderForm.vue'
import InfoAlert from '@/components/card/InfoAlert.vue'
import { getAllWarga } from '@/services/wargaService'
import { setAsetEditFormData, getAsetEditFormData } from '@/services/asetservice'
import { useRouter } from 'vue-router'
import profileDefault from '@/assets/default_profile.jpg'
import { getImageUrl } from '@/lib/axios.js'

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

function selectWarga(warga) {
  selectedWarga.value = warga
}

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