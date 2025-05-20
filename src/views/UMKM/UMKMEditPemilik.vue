<template>
  <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
    <HeaderForm title="Pilih Pemilik Usaha" @back="handleBack" />

    <div class="flex-1 flex flex-col">
      <div class="bg-white rounded-xl mx-4 mt-4 p-4">
        <div class="relative mb-3">
          <input v-model="search" type="text"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#00c48c]"
            placeholder="Cari Nama ..." />
          <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke-width="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke-width="2" />
          </svg>
        </div>
        <div class="font-semibold text-[#232360] mb-2">Daftar Warga</div>
        <div class="flex flex-col gap-2 max-h-[420px] overflow-y-auto">
          <div v-for="warga in filteredWarga" :key="warga.id"
            class="flex items-center px-2 py-2 rounded-lg hover:bg-[#f5f5f5] transition">
            <img :src="warga.foto_path || '/avatar-default.png'" alt="foto"
              class="w-10 h-10 rounded-full object-cover mr-3 border" />
            <div class="flex-1">
              <div class="font-medium text-[#232360] text-sm">{{ warga.nama }}</div>
              <div class="text-xs text-[#2e5eaa]">{{ warga.no_tlp }}</div>
            </div>
            <input type="checkbox" class="form-checkbox accent-[#00c48c] w-5 h-5"
              :checked="selectedIds.includes(warga.id)" @change="toggleWarga(warga)" />
          </div>
        </div>
      </div>
      <div class="mt-auto mb-4 mx-4">
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
import { useRouter, useRoute } from 'vue-router'
import { getAllWarga } from '@/services/wargaService'
import { setEditUmkmFormData, getEditUmkmFormData } from '@/services/umkmService'

const router = useRouter()
const route = useRoute()
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
  const formData = getEditUmkmFormData()
  if (formData.pemilik && Array.isArray(formData.pemilik)) {
    selectedIds.value = [...formData.pemilik]
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
  setEditUmkmFormData({ pemilik: selectedIds.value })
}

function submitPemilik() {
  setEditUmkmFormData({ pemilik: selectedIds.value })
  router.push({ name: 'umkmedit', params: { id: route.params.id } })
}

function handleBack() {
  router.back()
}
</script>