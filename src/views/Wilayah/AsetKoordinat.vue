<template>
  <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
    <HeaderForm title="Tambah Koordinat Objek" @back="handleBack" />

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
        <SubmitButton :label="'PILIH LOKASI'" :disabled="!lat || !lng || loading" @submit="pilihLokasi" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderForm from '@/components/card/HeaderForm.vue'
import SubmitButton from '@/components/card/SubmitButton.vue'
import L from '@/plugins/leaflet'
import { getAsetLokasi, updateAsetLokasi } from '@/services/asetservice'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const lat = ref(null)
const lng = ref(null)
const loading = ref(false)

onMounted(async () => {
  // Fetch lokasi aset
  let lokasi = null
  try {
    const { data } = await getAsetLokasi(id)
    if (data && data.data && data.data.latitude && data.data.longitude) {
      lokasi = {
        lat: parseFloat(data.data.latitude),
        lng: parseFloat(data.data.longitude)
      }
    }
  } catch (e) {
    // ignore error, fallback ke posisi user
  }

  // Jika tidak ada lokasi, pakai posisi user
  if (!lokasi) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          lokasi = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
          initMap(lokasi)
        },
        () => {
          // fallback Malang
          lokasi = { lat: -7.9797, lng: 112.6304 }
          initMap(lokasi)
        }
      )
    } else {
      lokasi = { lat: -7.9797, lng: 112.6304 }
      initMap(lokasi)
    }
  } else {
    initMap(lokasi)
  }
})

function initMap(lokasi) {
  lat.value = lokasi.lat
  lng.value = lokasi.lng
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
}

async function pilihLokasi() {
  if (!lat.value || !lng.value) return
  loading.value = true
  try {
    await updateAsetLokasi(id, lat.value, lng.value)
    router.back()
  } catch (e) {
    alert('Gagal menyimpan koordinat!')
  }
  loading.value = false
}

function handleBack() {
  router.back()
}
</script>