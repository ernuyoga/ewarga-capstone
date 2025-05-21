<template>
  <div class="min-h-screen bg-[#f6f6f6]">
    <div class="w-full mx-auto">
      <!-- Skeleton Loader -->
      <div v-if="isLoading">
        <!-- Skeleton Header -->
        <div class="bg-white shadow w-full px-4 md:px-8 lg:px-16 xl:px-24">
          <div class="flex justify-between items-center py-4">
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
        <div class="animate-pulse space-y-7 py-10 px-4 md:px-8 lg:px-16 xl:px-24">
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
        <div class="bg-white shadow px-4 md:px-8 lg:px-16 xl:px-24 py-4 w-full">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-xl lg:text-2xl font-bold text-[#03BF8C]">
                {{ wargaStatus }}
                <template v-if="instansi">
                  <span class="text-[#3A3361]">- RW {{ instansi.rw }} RT {{ instansi.rt }}</span>
                </template>
              </h1>
              <p v-if="instansi" class="text-sm lg:text-base text-gray-500">
                Kec. {{ instansi.m_kecamatan?.nama }}, Kota {{ instansi.m_kota?.nama }}
              </p>
            </div>
            <div class="flex items-center gap-4">
              <i class="icon-notification text-lg lg:text-xl"></i>
              <i class="icon-user text-lg lg:text-xl"></i>
            </div>
          </div>
        </div>

        <div class="space-y-4 py-4 px-4 md:px-8 lg:px-16 lg:py-6 xl:px-24">
          <!-- Layanan Section -->
          <section class="bg-white rounded-xl shadow p-6">
            <h2 class="text-lg lg:text-xl font-bold text-gray-800 mb-5">Layanan Utama Kami</h2>
            <div class="flex flex-col gap-5">
              <div
                class="flex-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                @click="goToUmkmDashboard">
                <h3 class="text-base lg:text-lg font-bold text-[#37306B] mb-2">Pendataan UMKM</h3>
                <p class="text-sm lg:text-base text-gray-400">UMKM di Wilayah Anda</p>
              </div>
              <div
                class="flex-1 bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                @click="goToWilayahDashboard">
                <h3 class="text-base lg:text-lg font-bold text-[#37306B] mb-2">Pemetaan Wilayah</h3>
                <p class="text-sm lg:text-base text-gray-400">Kelola Objek di Wilayah Anda</p>
              </div>
            </div>
          </section>

          <!-- Informasi Section -->
          <div class="flex flex-col gap-4 lg:grid lg:py-2 lg:grid-cols-2 lg:gap-8">
            <!-- UMKM Section -->
            <section class="bg-white rounded-xl shadow p-6">
              <div class="flex justify-between items-center">
                <h2 class="text-lg lg:text-xl font-bold text-gray-800">UMKM Pilihan di Sekitar Anda</h2>
                <button
                  class="bg-green-100 text-green-500 text-xs lg:text-sm font-bold px-2 py-1 rounded hover:bg-green-200"
                  @click="goToUmkmDashboard">Lihat Semua</button>
              </div>
              <p class="text-sm lg:text-base text-gray-500 mb-5">Jelajahi pilihan produk dan layanan unggulan dari UMKM
                sekitar.
              </p>
              <div class="space-y-5">
                <template v-if="umkmList.length === 0">
                  <div class="text-gray-400 italic text-center py-6">Data UMKM tidak ditemukan.</div>
                </template>
                <template v-else>
                  <div v-for="umkm in umkmList" :key="umkm.id"
                    class="flex gap-4 bg-white rounded-xl border p-5 shadow-sm hover:shadow-md cursor-pointer"
                    @click="goToUmkmDetail(umkm.id)">
                    <img :src="getImageUrl(umkm.fotos && umkm.fotos.length > 0 ? umkm.fotos[0].file_path : null)"
                      alt="Foto UMKM" class="bg-gray-200 w-20 h-20 rounded-lg object-cover" />
                    <div class="flex-1">
                      <h3 class="text-base lg:text-lg font-bold text-gray-800">{{ umkm.nama }}</h3>
                      <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full"
                          :class="umkm.jenis?.id === 1 ? 'bg-green-400' : 'bg-gray-400'"></span>
                        <span class="text-xs lg:text-sm font-bold"
                          :class="umkm.jenis?.id === 1 ? 'text-green-500' : 'text-gray-500'">
                          {{ umkm.jenis?.nama || '-' }}
                        </span>
                      </div>
                      <p class="text-xs lg:text-sm text-gray-400">{{ umkm.alamat }}</p>
                    </div>
                  </div>
                </template>
              </div>
            </section>

            <!-- Wilayah Section -->
            <section class="bg-white rounded-xl shadow p-4 md:p-5">
              <div class="flex justify-between items-center">
                <h2 class="text-lg lg:text-xl font-bold text-gray-800">Objek di Wilayah Anda</h2>
                <button
                  class="bg-green-100 text-green-500 text-xs lg:text-sm font-bold px-2 py-1 rounded hover:bg-green-200"
                  @click="goToWilayahDashboard">Lihat Semua</button>
              </div>
              <p class="text-sm lg:text-base text-gray-500 mb-4 md:mb-5">Jelajahi dan cari tahu objek yang ada di
                sekitar
                wilayah Anda.</p>
              <div class="flex gap-3 md:gap-4 overflow-x-auto pb-2 lg:justify-center">
                <template v-if="asetList.length === 0">
                  <div class="text-gray-400 italic text-center py-6 w-full">Data Objek tidak ditemukan.</div>
                </template>
                <template v-else>
                  <div v-for="aset in asetList" :key="aset.id"
                    class="min-w-[140px] max-w-[180px] w-full bg-gray-100 p-3 md:p-4 rounded-lg flex-shrink-0 shadow-sm hover:shadow-md cursor-pointer"
                    @click="goToAsetDetail(aset.id)">
                    <div class="aspect-square bg-gray-300 rounded mb-2"></div>
                    <h3 class="text-xs md:text-sm lg:text-base font-bold text-[#37306B] truncate">{{ aset.nama }}</h3>
                    <p class="text-[10px] md:text-xs lg:text-sm text-gray-400 truncate">{{ aset.jenis?.nama }} | {{
                      aset.warga?.nama }}</p>
                    <p class="text-[10px] md:text-xs lg:text-sm text-gray-400 truncate">{{ aset.alamat }}</p>
                  </div>
                </template>
              </div>
            </section>
          </div>

          <!-- Logout Button -->
          <button @click="handleLogout"
            class="w-full bg-blue-600 hover:bg-blue-700 text-base lg:text-lg font-bold text-white py-3 rounded-lg transition">Logout</button>
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
import { getImageUrl } from '@/lib/axios' // Tambahkan ini

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
      try {
        const resUmkm = await getAllUmkm({ instansi_id: warga.value.instansi_id })
        umkmList.value = (resUmkm.data.data || []).slice(0, 2)
      } catch (e) {
        umkmList.value = []
      }

      // Ambil Objek/Aset berdasarkan instansi
      try {
        const resAset = await getAllAsetByInstansi(warga.value.instansi_id)
        asetList.value = (resAset.data.data || []).slice(0, 3)
      } catch (e) {
        asetList.value = []
      }
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
