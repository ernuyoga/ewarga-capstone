<template>
  <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
    <HeaderForm title="Tambah Koordinat Usaha" @back="handleBack" />

    <div class="flex-1 flex flex-col px-4 md:px-8 lg:px-16 xl:px-24">
      <div id="map" class="w-full flex-1 rounded-b-xl focus:outline-none focus:ring-1 focus:ring-[#03BF8C]"
        style="height: 350px;"></div>
      <div class="p-2 md:p-4">
        <div class="mb-2 text-center text-gray-600 text-sm md:text-base">
          <div v-if="lat && lng">
            <span>{{ lat }}, {{ lng }}</span>
          </div>
          <div v-else>
            Silakan pilih lokasi pada peta
          </div>
        </div>
        <SubmitButton :label="'PILIH LOKASI'" :disabled="!lat || !lng" @submit="pilihLokasi" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import L from '@/plugins/leaflet' // Gunakan plugin global yang sudah kamu buat
import HeaderForm from '../../components/card/HeaderForm.vue'
import SubmitButton from '../../components/card/SubmitButton.vue'
import { setUmkmFormData, getUmkmFormData } from '@/services/umkmService'

const router = useRouter()
const lat = ref(null)
const lng = ref(null)

onMounted(() => {
  // Titik default (Malang)
  const defaultLat = -7.9675
  const defaultLng = 112.6326

  const formData = getUmkmFormData()
  lat.value = formData.lokasi_lat || defaultLat
  lng.value = formData.lokasi_lng || defaultLng

  const map = L.map('map').setView([lat.value, lng.value], 15)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  const marker = L.marker([lat.value, lng.value], { draggable: true }).addTo(map)

  marker.on('dragend', () => {
    const pos = marker.getLatLng()
    lat.value = pos.lat
    lng.value = pos.lng
  })

  map.on('click', (e) => {
    lat.value = e.latlng.lat
    lng.value = e.latlng.lng
    marker.setLatLng(e.latlng)
  })
})

function pilihLokasi() {
  setUmkmFormData({
    lokasi_lat: lat.value,
    lokasi_lng: lng.value
  })
  router.push({ name: 'addumkm' })
}

function handleBack() {
  router.push({ name: 'addumkm' })
}
</script>
