<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4 h-auto p-4">
        <div>
          <span class="font-semibold text-green-500 text-xl">
            {{ wargaStatus }}
            <template v-if="instansi">
              - RW {{ instansi.rw }} RT {{ instansi.rt }}
            </template>
          </span>
        </div>
        <div class="flex items-center space-x-4">
          <i class="icon-notification"></i>
          <i class="icon-user"></i>
        </div>
      </div>
      <div v-if="instansi" class="mb-6 text-gray-500 text-sm">
        Kec. {{ instansi.m_kecamatan?.nama }}, Kota {{ instansi.m_kota?.nama }}
      </div>

      <!-- Layanan Utama Section -->
      <h2 class="text-lg font-bold my-4 text-gray-800">Layanan Utama Kami</h2>
      <div class="flex gap-4 mb-6">
        <div
          class="flex-1 flex items-center justify-between bg-white border border-gray-200 rounded-xl p-5 transition shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-200"
          @click="goToUmkmDashboard">
          <div class="flex flex-col">
            <div class="font-semibold text-base text-[#37306B] mb-1">Pendataan UMKM</div>
            <div class="text-sm text-gray-400">UMKM di Wilayah Anda</div>
          </div>
        </div>
        <div
          class="flex-1 flex items-center justify-between bg-white border border-gray-200 rounded-xl p-5 transition shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-200"
          @click="goToWilayahDashboard">
          <div class="flex flex-col">
            <div class="font-semibold text-base text-[#37306B] mb-1">Pemetaan Wilayah</div>
            <div class="text-sm text-gray-400">Kelola Objek di Wilayah Anda</div>
          </div>
        </div>
      </div>

      <!-- UMKM Section -->
      <h2 class="text-lg font-bold my-4 text-gray-800 flex items-center justify-between">
        <span>UMKM Pilihan di Sekitar Anda</span>
        <button
          class="bg-green-100 text-green-500 text-xs font-semibold px-4 py-1 rounded-lg transition hover:bg-green-200 border-none"
          @click="goToUmkmDashboard">Lihat Semua</button>
      </h2>
      <p class="mb-2 text-gray-500 text-sm">
        Jelajahi pilihan produk dan layanan unggulan dari UMKM sekitar.
      </p>
      <div class="flex flex-col">
        <div v-for="umkm in umkmList" :key="umkm.id"
          class="flex items-start gap-3 p-3 bg-white rounded-xl shadow border mb-2 border-slate-100 cursor-pointer"
          @click="goToUmkmDetail(umkm.id)">
          <div class="bg-gray-200 rounded-lg w-12 h-12"></div>
          <div class="flex-1">
            <div class="font-semibold text-base text-gray-800">{{ umkm.nama }}</div>
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-block w-2 h-2 rounded-full"
                :class="umkm.jenis === 1 ? 'bg-green-400' : 'bg-gray-400'"></span>
              <span class="text-xs font-semibold" :class="umkm.jenis === 1 ? 'text-green-500' : 'text-gray-500'">
                {{ umkm.jenis === 1 ? 'Usaha Offline' : 'Usaha Online' }}
              </span>
            </div>
            <div class="text-xs text-gray-400">
              {{ umkm.alamat }}
            </div>
          </div>
        </div>
      </div>

      <!-- Wilayah Section -->
      <h2 class="text-lg font-bold my-4 text-gray-800 flex items-center justify-between">
        <span>Objek di Wilayah Anda</span>
        <button
          class="bg-green-100 text-green-500 text-xs font-semibold px-4 py-1 rounded-lg transition hover:bg-green-200 border-none"
          @click="goToWilayahDashboard">Lihat Semua</button>
      </h2>
      <p class="mb-2 text-gray-500 text-sm">
        Jelajahi dan cari tahu objek yang ada di sekitar wilayah Anda.
      </p>
      <div class="flex gap-5 mb-6 justify-start flex-nowrap overflow-x-auto pb-1">
        <div v-for="aset in asetList" :key="aset.id"
          class="bg-gray-100 rounded-xl p-2.5 flex flex-col items-start min-w-[180px] max-w-[200px] w-full box-border flex-shrink-0">
          <div class="w-full aspect-square bg-gray-300 rounded-lg mb-3"></div>
          <div class="font-semibold text-[1.05rem] text-[#37306B] mb-1 truncate w-full">{{ aset.nama }}</div>
          <div class="text-[0.95rem] text-gray-400 mb-1 truncate w-full">
            {{ aset.jenis?.nama }} | {{ aset.warga?.nama }}
          </div>
          <div class="text-[0.85rem] text-gray-400 truncate w-full">
            {{ aset.alamat }}
          </div>
        </div>
      </div>

      <button @click="handleLogout"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200">Logout</button>
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

const warga = ref(null)
const instansi = ref(null)
const umkmList = ref([])
const asetList = ref([]) // State untuk objek/aset wilayah

const wargaStatus = computed(() => {
  if (!warga.value) return ''
  return warga.value.is_pengurus ? 'Pengurus' : 'Warga'
})

onMounted(async () => {
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

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>
