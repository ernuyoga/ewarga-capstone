<template>
  <div class="min-h-screen bg-[#f6f6f6]">
    <div class="w-full mx-auto">

      <!-- Skeleton Loader -->
      <div v-if="isLoading">
        <!-- Skeleton Header -->
        <div class="bg-white shadow w-full">
          <div class="flex justify-between items-center px-8 py-4">
            <div class="flex-1">
              <div class="h-6 w-40 bg-gray-200 rounded mb-2"></div>
              <div class="h-4 w-56 bg-gray-200 rounded"></div>
            </div>
            <div class="flex items-center gap-4">
              <div class="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div class="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
        <!-- Skeleton Content -->
        <div class="animate-pulse space-y-6 py-8 px-4">
          <div class="h-8 bg-gray-200 rounded w-1/2"></div>
          <div class="h-6 bg-gray-200 rounded w-1/3"></div>
          <div class="flex gap-4">
            <div class="h-20 bg-gray-200 rounded-xl flex-1"></div>
            <div class="h-20 bg-gray-200 rounded-xl flex-1"></div>
          </div>
          <div class="h-6 bg-gray-200 rounded w-1/2"></div>
          <div class="space-y-2">
            <div class="h-12 bg-gray-200 rounded-xl"></div>
            <div class="h-12 bg-gray-200 rounded-xl"></div>
            <div class="h-12 bg-gray-200 rounded-xl"></div>
          </div>
          <div class="h-6 bg-gray-200 rounded w-1/2"></div>
          <div class="flex gap-4 overflow-x-auto">
            <div class="h-32 bg-gray-200 rounded-xl w-1/3 flex-shrink-0"></div>
            <div class="h-32 bg-gray-200 rounded-xl w-1/3 flex-shrink-0"></div>
            <div class="h-32 bg-gray-200 rounded-xl w-1/3 flex-shrink-0"></div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Header -->
        <div class="bg-white shadow px-8 py-4 w-full">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-xl font-semibold text-[#03BF8C]">
                {{ wargaStatus }}
                <template v-if="instansi">
                  <span class="text-[#3A3361]">- RW {{ instansi.rw }} RT {{ instansi.rt }}</span>
                </template>
              </h1>
              <p v-if="instansi" class="text-sm text-gray-500">
                Kec. {{ instansi.m_kecamatan?.nama }}, Kota {{ instansi.m_kota?.nama }}
              </p>
            </div>
            <div class="flex items-center gap-4">
              <i class="icon-notification"></i>
              <i class="icon-user"></i>
            </div>
          </div>
        </div>

        <div class="space-y-6 py-6 px-8">
          <!-- Layanan Section -->
          <section class="bg-white rounded-xl shadow p-4">
            <h2 class="text-lg font-bold text-gray-800 mb-4">Layanan Utama Kami</h2>
            <div class="flex flex-col gap-4">
              <div
                class="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                @click="goToUmkmDashboard">
                <h3 class="text-base font-semibold text-[#37306B] mb-1">Pendataan UMKM</h3>
                <p class="text-sm text-gray-400">UMKM di Wilayah Anda</p>
              </div>
              <div
                class="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                @click="goToWilayahDashboard">
                <h3 class="text-base font-semibold text-[#37306B] mb-1">Pemetaan Wilayah</h3>
                <p class="text-sm text-gray-400">Kelola Objek di Wilayah Anda</p>
              </div>
            </div>
          </section>

          <!-- UMKM Section -->
          <section class="bg-white rounded-xl shadow p-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold text-gray-800">UMKM Pilihan di Sekitar Anda</h2>
              <button class="bg-green-100 text-green-500 text-sm font-semibold px-3 py-1 rounded hover:bg-green-200"
                @click="goToUmkmDashboard">Lihat Semua</button>
            </div>
            <p class="text-sm text-gray-500 mb-4">Jelajahi pilihan produk dan layanan unggulan dari UMKM sekitar.</p>
            <div class="space-y-4">
              <div v-for="umkm in umkmList" :key="umkm.id"
                class="flex gap-3 bg-white rounded-xl border p-4 shadow cursor-pointer"
                @click="goToUmkmDetail(umkm.id)">
                <div class="bg-gray-200 w-16 h-16 rounded-lg"></div>
                <div class="flex-1">
                  <h3 class="text-base font-semibold text-gray-800">{{ umkm.nama }}</h3>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full"
                      :class="umkm.jenis === 1 ? 'bg-green-400' : 'bg-gray-400'"></span>
                    <span class="text-xs font-semibold" :class="umkm.jenis === 1 ? 'text-green-500' : 'text-gray-500'">
                      {{ umkm.jenis === 1 ? 'Usaha Offline' : 'Usaha Online' }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-400">{{ umkm.alamat }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Wilayah Section -->
          <section class="bg-white rounded-xl shadow p-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-bold text-gray-800">Objek di Wilayah Anda</h2>
              <button class="bg-green-100 text-green-500 text-sm font-semibold px-3 py-1 rounded hover:bg-green-200"
                @click="goToWilayahDashboard">Lihat Semua</button>
            </div>
            <p class="text-sm text-gray-500 mb-4">Jelajahi dan cari tahu objek yang ada di sekitar wilayah Anda.</p>
            <div class="flex gap-4 overflow-x-auto pb-2">
              <div v-for="aset in asetList" :key="aset.id"
                class="min-w-[180px] max-w-[220px] w-full bg-gray-100 p-4 rounded-xl flex-shrink-0 cursor-pointer"
                @click="goToAsetDetail(aset.id)">
                <div class="aspect-square bg-gray-300 rounded-lg mb-2"></div>
                <h3 class="text-sm font-semibold text-[#37306B] truncate">{{ aset.nama }}</h3>
                <p class="text-xs text-gray-400 truncate">{{ aset.jenis?.nama }} | {{ aset.warga?.nama }}</p>
                <p class="text-xs text-gray-400 truncate">{{ aset.alamat }}</p>
              </div>
            </div>
          </section>

          <!-- Logout Button -->
          <button @click="handleLogout"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">Logout</button>
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
      asetList.value = (resAset.data.data || []).slice(0, 3)
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
