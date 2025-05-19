<template>
  <div class="min-h-screen bg-[#f6f6f6]">
    <div class="w-full mx-auto">
      <!-- Skeleton Loader -->
      <div v-if="isLoading">
        <!-- Skeleton Header -->
        <div class="bg-white shadow w-full">
          <div class="flex justify-between items-center px-8 py-4">
            <div class="flex-1">
              <div class="h-7 w-44 bg-gray-200 rounded mb-2"></div>
              <div class="h-5 w-60 bg-gray-200 rounded"></div>
            </div>
            <div class="flex items-center gap-4">
              <div class="h-9 w-9 bg-gray-200 rounded-full"></div>
              <div class="h-9 w-9 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
        <!-- Skeleton Content -->
        <div class="animate-pulse space-y-7 py-10 px-5">
          <div class="h-9 bg-gray-200 rounded w-2/3"></div>
          <div class="h-7 bg-gray-200 rounded w-1/2"></div>
          <div class="flex gap-4">
            <div class="h-24 bg-gray-200 rounded-xl flex-1"></div>
            <div class="h-24 bg-gray-200 rounded-xl flex-1"></div>
          </div>
          <div class="h-7 bg-gray-200 rounded w-2/3"></div>
          <div class="space-y-3">
            <div class="h-14 bg-gray-200 rounded-xl"></div>
            <div class="h-14 bg-gray-200 rounded-xl"></div>
            <div class="h-14 bg-gray-200 rounded-xl"></div>
          </div>
          <div class="h-7 bg-gray-200 rounded w-2/3"></div>
          <div class="flex gap-4 overflow-x-auto">
            <div class="h-36 bg-gray-200 rounded-xl w-1/3 flex-shrink-0"></div>
            <div class="h-36 bg-gray-200 rounded-xl w-1/3 flex-shrink-0"></div>
            <div class="h-36 bg-gray-200 rounded-xl w-1/3 flex-shrink-0"></div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Header -->
        <div class="bg-white shadow px-24 py-4 w-full">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-[#03BF8C]">
                {{ wargaStatus }}
                <template v-if="instansi">
                  <span class="text-[#3A3361]">- RW {{ instansi.rw }} RT {{ instansi.rt }}</span>
                </template>
              </h1>
              <p v-if="instansi" class="text-base text-gray-500">
                Kec. {{ instansi.m_kecamatan?.nama }}, Kota {{ instansi.m_kota?.nama }}
              </p>
            </div>
            <div class="flex items-center gap-4">
              <i class="icon-notification text-xl"></i>
              <i class="icon-user text-xl"></i>
            </div>
          </div>
        </div>

        <div class="space-y-8 py-8 px-24">
          <!-- Layanan Section -->
          <section class="bg-white rounded-xl shadow p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-5">Layanan Utama Kami</h2>
            <div class="flex flex-col gap-5">
              <div
                class="flex-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                @click="goToUmkmDashboard">
                <h3 class="text-lg font-bold text-[#37306B] mb-2">Pendataan UMKM</h3>
                <p class="text-base text-gray-400">UMKM di Wilayah Anda</p>
              </div>
              <div
                class="flex-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                @click="goToWilayahDashboard">
                <h3 class="text-lg font-bold text-[#37306B] mb-2">Pemetaan Wilayah</h3>
                <p class="text-base text-gray-400">Kelola Objek di Wilayah Anda</p>
              </div>
            </div>
          </section>

          <!-- UMKM Section -->
          <section class="bg-white rounded-xl shadow p-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-800">UMKM Pilihan di Sekitar Anda</h2>
              <button class="bg-green-100 text-green-500 text-sm font-bold px-2 py-1 rounded hover:bg-green-200"
                @click="goToUmkmDashboard">Lihat Semua</button>
            </div>
            <p class="text-base text-gray-500 mb-5">Jelajahi pilihan produk dan layanan unggulan dari UMKM sekitar.</p>
            <div class="space-y-5">
              <div v-for="umkm in umkmList" :key="umkm.id"
                class="flex gap-4 bg-white rounded-xl border p-5 shadow cursor-pointer"
                @click="goToUmkmDetail(umkm.id)">
                <div class="bg-gray-200 w-20 h-20 rounded-lg"></div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold text-gray-800">{{ umkm.nama }}</h3>
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full"
                      :class="umkm.jenis === 1 ? 'bg-green-400' : 'bg-gray-400'"></span>
                    <span class="text-sm font-bold" :class="umkm.jenis === 1 ? 'text-green-500' : 'text-gray-500'">
                      {{ umkm.jenis === 1 ? 'Usaha Offline' : 'Usaha Online' }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-400">{{ umkm.alamat }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Wilayah Section -->
          <section class="bg-white rounded-xl shadow p-6">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-bold text-gray-800">Objek di Wilayah Anda</h2>
              <button class="bg-green-100 text-green-500 text-sm font-bold px-2 py-1 rounded hover:bg-green-200"
                @click="goToWilayahDashboard">Lihat Semua</button>
            </div>
            <p class="text-base text-gray-500 mb-5">Jelajahi dan cari tahu objek yang ada di sekitar wilayah Anda.</p>
            <div class="flex gap-5 overflow-x-auto pb-2">
              <div v-for="aset in asetList" :key="aset.id"
                class="min-w-[200px] max-w-[240px] w-full bg-gray-100 p-5 rounded-xl flex-shrink-0 cursor-pointer"
                @click="goToAsetDetail(aset.id)">
                <div class="aspect-square bg-gray-300 rounded-lg mb-3"></div>
                <h3 class="text-base font-bold text-[#37306B] truncate">{{ aset.nama }}</h3>
                <p class="text-sm text-gray-400 truncate">{{ aset.jenis?.nama }} | {{ aset.warga?.nama }}</p>
                <p class="text-sm text-gray-400 truncate">{{ aset.alamat }}</p>
              </div>
            </div>
          </section>

          <!-- Logout Button -->
          <button @click="handleLogout"
            class="w-full bg-blue-600 hover:bg-blue-700 text-lg font-bold text-white py-3 rounded-lg transition">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import { getInstansiById } from '@/services/instansiService'
import { getWargaById } from '@/services/wargaService'
import { getAllUmkm } from '@/services/umkmService'
import { getAllAsetByInstansi } from '@/services/wilayahService' // Tambahkan ini

const auth = useAuthStore()
const router = useRouter()
const isLoading = ref(true)

const warga = ref(null)
const instansi = ref(null)
const umkmList = ref([])
const asetList = ref([]) // State untuk objek/aset wilayah

const wargaStatus = computed(() => {
  if (!warga.value) return ''
  return warga.value.is_pengurus ? 'Pengurus' : 'Warga'
})

onMounted(async () => {
  isLoading.value = true
  if (auth.user?.id) {
    // Ambil data warga
    const resWarga = await getWargaById(auth.user.id)
    warga.value = resWarga.data.data

    // Ambil data instansi
    if (warga.value?.instansi_id) {
      const resInstansi = await getInstansiById(warga.value.instansi_id)
      instansi.value = resInstansi.data.data

      // Ambil UMKM berdasarkan instansi
      const resUmkm = await getAllUmkm({ instansi_id: warga.value.instansi_id })
      umkmList.value = (resUmkm.data.data || []).slice(0, 3)

      // Ambil Objek/Aset berdasarkan instansi
      const resAset = await getAllAsetByInstansi(warga.value.instansi_id)
      asetList.value = (resAset.data.data || []).slice(0, 5)
    }
  }
  isLoading.value = false
})

function goToUmkmDashboard() {
  router.push('/umkm/dashboard')
}

function goToWilayahDashboard() {
  router.push('/wilayah/dashboard')
}

function goToUmkmDetail(id) {
  router.push({ name: "umkm-detail", params: { id } });
}

function goToAsetDetail(id) {
  router.push({ name: "aset-detail", params: { id } });
}

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>
