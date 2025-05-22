<template>
  <div class="min-h-screen bg-[#f6f6f6]">
    <HeaderForm title="Tambah Koordinat Objek" @back="router.back()" />
    <div class="mx-4 mt-4">
      <div class="rounded-xl overflow-hidden mb-4">
        <div id="map" class="w-full h-96"></div>
      </div>
      <div class="mb-4">
        <div class="text-sm text-gray-500">Latitude: {{ lat }}</div>
        <div class="text-sm text-gray-500">Longitude: {{ lng }}</div>
      </div>
      <button
        class="w-full bg-[#4f4f8f] text-white py-3 rounded-xl font-bold"
        @click="handleSimpan"
        :disabled="loading"
      >
        PILIH LOKASI
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderForm from '@/components/card/HeaderForm.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getAsetLokasi, updateAsetLokasi } from '@/services/asetservice'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const lat = ref(null)
const lng = ref(null)
const loading = ref(false)
let map, marker

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
  map = L.map('map').setView([lat.value, lng.value], 16)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)
  marker = L.marker([lat.value, lng.value], { draggable: true }).addTo(map)
  marker.on('dragend', e => {
    const pos = e.target.getLatLng()
    lat.value = pos.lat
    lng.value = pos.lng
  })
  map.on('click', e => {
    lat.value = e.latlng.lat
    lng.value = e.latlng.lng
    marker.setLatLng(e.latlng)
  })
}

async function handleSimpan() {
  loading.value = true
  try {
    await updateAsetLokasi(id, lat.value, lng.value)
    router.back()
  } catch (e) {
    alert('Gagal menyimpan koordinat!')
  }
  loading.value = false
}
</script>