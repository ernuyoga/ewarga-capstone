<template>
  <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
    <HeaderForm title="Pilih Pemilik Usaha" @back="handleBack" />

    <div class="flex-1 flex flex-col">
      <div class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6">
        <div class="relative mb-3">
          <input v-model="search" type="text"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-3 pr-10 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#00c48c]"
            placeholder="Cari Nama ..." />
          <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke-width="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="2" />
          </svg>
        </div>
        <div class="font-semibold text-[#232360] mt-6 mb-2 text-base md:text-lg">Daftar Warga</div>
        <div class="flex flex-col gap-2 max-h-[420px] overflow-y-auto">
          <div v-for="warga in filteredWarga" :key="warga.id"
            class="flex items-center px-2 md:px-4 py-2 md:py-3 rounded-lg hover:bg-[#f5f5f5] transition cursor-pointer select-none"
            @click="toggleWarga(warga)">
            <img :src="warga.foto_path || profileDefault" alt="foto"
              class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mr-3 border" />
            <div class="flex-1">
              <div class="font-medium text-[#232360] text-sm md:text-base">{{ warga.nama }}</div>
              <div class="text-xs md:text-sm text-[#2e5eaa]">{{ warga.no_tlp }}</div>
            </div>
            <label class="inline-flex items-center">
              <input type="checkbox" class="hidden" :checked="selectedIds.includes(warga.id)" tabindex="-1" readonly />
              <div class="w-5 h-5 md:w-6 md:h-6 rounded border border-gray-300 flex items-center justify-center"
                :class="selectedIds.includes(warga.id) ? 'bg-[#00c48c]' : 'bg-white'">
                <svg v-if="selectedIds.includes(warga.id)" class="w-3 h-3 md:w-4 md:h-4 text-white" fill="none"
                  stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div class="mt-auto mb-4 mx-4 md:mx-8 lg:mx-16 xl:mx-24">
        <SubmitButton @submit="submitPemilik" :disabled="selectedIds.length === 0">
          PILIH
        </SubmitButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeaderForm from '../../components/card/HeaderForm.vue'
import SubmitButton from '../../components/card/SubmitButton.vue'
import { useRouter } from 'vue-router'
import { getAllWarga } from '@/services/wargaService'
import { setUmkmFormData, getUmkmFormData } from '@/services/umkmService'
import profileDefault from '@/assets/profile.jpg' // Tambahkan ini

const router = useRouter()
const search = ref('')
const wargaList = ref([])
const selectedIds = ref([])

const filteredWarga = computed(() => {
  if (!search.value) return wargaList.value
  return wargaList.value.filter(w =>
    w.nama.toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(async () => {
  try {
    const { data } = await getAllWarga()
    if (data && data.data) {
      wargaList.value = data.data
    }
  } catch (e) {
    wargaList.value = []
  }
  // Ambil ulang data pemilik dari localStorage
  const formData = getUmkmFormData()
  if (formData.pemilik_ids && Array.isArray(formData.pemilik_ids)) {
    selectedIds.value = [...formData.pemilik_ids]
  } else {
    selectedIds.value = []
  }
})

function toggleWarga(warga) {
  const idx = selectedIds.value.indexOf(warga.id)
  if (idx === -1) {
    selectedIds.value.push(warga.id)
  } else {
    selectedIds.value.splice(idx, 1)
  }
  setUmkmFormData({ pemilik_ids: selectedIds.value })
}

function submitPemilik() {
  setUmkmFormData({ pemilik_ids: selectedIds.value })
  router.push({ name: 'addumkm' })
}

function handleBack() {
  router.push({ name: 'addumkm' })
}
</script>