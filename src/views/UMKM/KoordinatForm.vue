<!-- KoordinatForm.vue -->
<template>
  <div class="max-w-[430px] mx-auto min-h-screen bg-white flex flex-col">
    <HeaderForm title="Tambah koordinat umkm" @back="handleBack" />
    <div class="flex-1 flex flex-col">
      <div id="map" class="w-full flex-1" style="height: 350px;"></div>
      <div class="p-4">
        <div class="mb-2 text-center text-gray-600">
          <div v-if="lat && lng">
            <span>Latitude: {{ lat }}</span> <br>
            <span>Longitude: {{ lng }}</span>
          </div>
          <div v-else>
            Silakan pilih lokasi pada peta
          </div>
        </div>
        <button
          class="w-full bg-[#6c6c6c] text-white rounded-lg py-2 font-semibold"
          :disabled="!lat || !lng"
          @click="pilihLokasi"
        >
          PILIH LOKASI
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import HeaderForm from '../../components/card/HeaderForm.vue'
import SubmitButton from '../../components/card/SubmitButton.vue'
import 'leaflet/dist/leaflet.css'
import { setUmkmFormData, getUmkmFormData } from '@/services/umkmService'

const router = useRouter()
const lat = ref(null)
const lng = ref(null)

onMounted(() => {
  // Default center (misal Malang)
  const defaultLat = -7.9675
  const defaultLng = 112.6326

  // Cek jika sudah ada di localStorage
  const formData = getUmkmFormData()
  lat.value = formData.lokasi_lat || defaultLat
  lng.value = formData.lokasi_lng || defaultLng

  const map = L.map('map').setView([lat.value, lng.value], 15)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // Marker yang bisa dipindah
  const marker = L.marker([lat.value, lng.value], { draggable: true }).addTo(map)

  marker.on('dragend', (e) => {
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