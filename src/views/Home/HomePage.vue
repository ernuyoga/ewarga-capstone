<template>
  <div class="min-h-screen bg-[#f6f6f6]">
    <div class="w-full mx-auto">
      <!-- Skeleton Loader -->
      <div v-if="isLoading">
        <!-- Skeleton Header -->
        <div class="bg-white shadow w-full px-4 md:px-8 lg:px-16 xl:px-28">
          <div class="flex justify-between items-center py-4">
            <div class="flex-1">
              <div class="h-7 w-64 bg-gray-200 rounded mb-2"></div>
              <div class="h-5 w-60 bg-gray-200 rounded"></div>
            </div>
            <div class="flex items-center gap-4">
              <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
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
        <div class="bg-white shadow px-4 md:px-8 lg:px-16 xl:px-28 py-4 w-full">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-xl lg:text-2xl font-semibold text-[#03BF8C]">
                {{ wargaStatus }}
                <template v-if="instansi">
                  <span class="text-lg lg:text-xl text-[#3A3361]">- RW {{ instansi.rw }} RT {{ instansi.rt }}</span>
                </template>
              </h1>
              <p v-if="instansi" class="text-sm lg:text-base text-gray-500">
                Kec. {{ instansi.m_kecamatan?.nama }}, Kota {{ instansi.m_kota?.nama }}
              </p>
            </div>
            <div class="flex items-center gap-4">
              <img src="@/assets/icon_profile.svg" alt="Profile"
                class="w-8 h-8 lg:w-10 lg:h-10 rounded-full hover:shadow-xl cursor-pointer" />
            </div>
          </div>
        </div>

        <div class="space-y-4 py-4 px-4 md:px-8 lg:px-16 lg:py-6 xl:px-24">
          <!-- Layanan Section -->
          <section class="bg-white rounded-xl shadow p-4">
            <h2 class="text-lg lg:text-xl font-bold text-gray-800 mb-3">Layanan Utama Kami</h2>
            <div class="flex flex-row gap-5">
              <div
                class="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden"
                @click="goToUmkmDashboard">
                <!-- Background Icon -->
                <img src="@/assets/umkm_icon.svg" alt="UMKM Icon"
                  class="absolute right-0 bottom-0 w-11 h-11 pointer-events-none select-none" />
                <div class="p-3 relative z-10">
                  <div class="flex justify-between">
                    <h3 class="text-base lg:text-lg font-bold text-[#37306B] mb-2">Pendataan UMKM</h3>
                    <img src="@/assets/panah.svg" alt="Panah" class="mr-2 mb-2">
                  </div>
                  <p class="text-sm lg:text-base text-gray-400">Kelola UMKM di Wilayah Anda</p>
                </div>
              </div>

              <div
                class="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer relative overflow-hidden"
                @click="goToWilayahDashboard">
                <!-- Background Icon -->
                <img src="@/assets/wilayah_icon.svg" alt="Wilayah Icon"
                  class="absolute right-0 bottom-0 w-11 h-11 pointer-events-none select-none" />
                <div class="p-3 relative z-10">
                  <div class="flex justify-between">
                    <h3 class="text-base lg:text-lg font-bold text-[#37306B] mb-2">Pemetaan Wilayah</h3>
                    <img src="@/assets/panah.svg" alt="Panah" class="mr-2 mb-2">
                  </div>
                  <p class="text-sm lg:text-base text-gray-400">Kelola Objek di Wilayah Anda</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Informasi Section -->
          <div class="flex flex-col gap-4 lg:grid lg:py-2 lg:grid-cols-2 lg:gap-8">
            <!-- UMKM Section -->
            <section class="bg-white rounded-xl shadow p-4 flex flex-col" style="height: 361px;">
              <div class="flex justify-between items-start">
                <h2 class="text-lg lg:text-xl font-bold text-gray-800">UMKM Pilihan di Sekitar Anda</h2>
                <button
                  class="bg-[#E6FFF8] text-[#03BF8C] text-xs lg:text-sm font-bold px-2 py-1 rounded-md min-w-[87.35px] text-center"
                  @click="goToUmkmDashboard">Lihat Semua</button>
              </div>
              <p class="text-sm lg:text-base text-gray-500 mb-5">Jelajahi pilihan produk dan layanan unggulan dari UMKM
                sekitar.
              </p>
              <div class="flex-1 space-y-3 overflow-y-auto pr-2">
                <template v-if="umkmList.length === 0">
                  <div class="text-gray-400 italic text-center py-6">Data UMKM tidak ditemukan.</div>
                </template>
                <template v-else>
                  <div v-for="(umkm, idx) in umkmList" :key="umkm.id">
                    <div
                      class="flex items-center gap-3 cursor-pointer border border-transparent hover:border-gray-200 rounded transition"
                      @click="goToUmkmDetail(umkm.id)">
                      <img :src="getImageUrl(umkm.fotos && umkm.fotos.length > 0 ? umkm.fotos[0].file_path : null)"
                        alt="Foto UMKM" class="bg-gray-200 w-16 h-16 lg:w-20 lg:h-20 rounded object-cover" />
                      <div class="flex-1 min-w-0">
                        <h3 class="text-base font-bold text-gray-800 truncate">{{ umkm.nama }}</h3>
                        <div class="inline-flex items-center gap-2 px-1 rounded-2xl"
                          :class="umkm.jenis?.id === 2 ? 'bg-gray-100' : 'bg-green-50'">
                          <span class="w-2.5 h-2.5 rounded-full"
                            :class="umkm.jenis?.id === 2 ? 'bg-gray-400' : 'bg-green-400'"></span>
                          <span class="text-xs font-bold"
                            :class="umkm.jenis?.id === 2 ? 'text-gray-500' : 'text-green-500'">
                            {{ umkm.jenis?.nama || '-' }}
                          </span>
                        </div>
                        <p class="text-xs text-gray-400 truncate">{{ umkm.alamat }}</p>
                      </div>
                    </div>
                    <hr v-if="idx < umkmList.length - 1" class="my-2 border-gray-200" />
                  </div>
                </template>
              </div>
            </section>

            <!-- Wilayah Section -->
            <section class="bg-white rounded-xl shadow p-4">
              <div class="flex justify-between items-start">
              <h2 class="text-lg lg:text-xl font-bold text-gray-800">Objek di Wilayah Anda</h2>
              <button
                class="bg-[#E6FFF8] text-[#03BF8C] text-xs lg:text-sm font-bold px-2 py-1 rounded-md min-w-[87.35px] text-center"
                @click="goToWilayahDashboard">Lihat Semua</button>
              </div>
              <p class="text-sm lg:text-base text-gray-500 mb-5">Jelajahi dan cari tahu objek yang ada di sekitar
              wilayah Anda.
              </p>
              <div>
              <template v-if="asetList.length === 0">
                <div class="text-gray-400 italic text-center py-6">Data Objek tidak ditemukan.</div>
              </template>
              <template v-else>
                <div class="flex gap-4 overflow-x-auto pb-2">
                <div v-for="aset in asetList" :key="aset.id"
                  class="w-[170px] max-w-[170px] min-w-[170px] bg-white rounded-xl hover:bg-gray-50 transition cursor-pointer flex-shrink-0 flex flex-col items-center p-2"
                  @click="goToAsetDetail(aset.id)">
                  <div class="bg-gray-200 w-[150px] h-[150px] rounded flex items-center justify-center mb-2 overflow-hidden">
                  <img
                    v-if="aset.fotos && aset.fotos.length > 0"
                    :src="getImageUrl(aset.fotos[0].file_path)"
                    alt="Foto Aset"
                    class="object-cover w-full h-full rounded"
                  />
                  <span v-else class="text-gray-400 text-xs">No Image</span>
                  </div>
                  <div class="p-1 pb-0 w-full">
                  <h3 class="text-base font-bold text-gray-800 truncate w-full text-left">{{ aset.nama }}</h3>
                  <p class="text-xs text-gray-500 truncate w-full text-left">
                    {{ aset.jenis?.nama || '-' }} | {{ aset.warga?.nama || '-' }}
                  </p>
                  <p class="text-xs text-gray-400 w-full text-left max-w-[150px] break-words line-clamp-2"
                    style="line-clamp:2; -webkit-line-clamp:2; display:-webkit-box; -webkit-box-orient:vertical; overflow:hidden;">
                    {{ aset.alamat }}
                  </p>
                  </div>
                </div>
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
        umkmList.value = (resUmkm.data.data || []).slice(0, 5)
      } catch (e) {
        umkmList.value = []
      }

      // Ambil Objek/Aset berdasarkan instansi
      try {
        const resAset = await getAllAsetByInstansi(warga.value.instansi_id)
        asetList.value = (resAset.data.data || []).slice(0, 5)
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
