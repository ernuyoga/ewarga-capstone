<template>
  <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
    <HeaderForm :title="'Tambah Penghuni'" @back="router.back" />

    <div class="flex-1 flex flex-col">
      <div class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6">
        <div class="relative mb-3">
          <div class="relative">
            <input v-model="search" type="text" placeholder="Cari Nama..."
              class="w-full border border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-3 pr-10 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C]" />
            <img src="@/assets/search_icon.svg" alt="Search"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 pointer-events-none" />
          </div>
        </div>
        <div class="font-semibold text-[#232360] mt-6 mb-2 text-base md:text-lg">Daftar Warga</div>
        <div class="flex flex-col gap-2 max-h-[420px] overflow-y-auto">
          <template v-if="filteredWarga.length">
            <div v-for="w in filteredWarga" :key="w.id"
              class="flex items-center px-2 md:px-4 py-2 md:py-3 rounded-lg hover:bg-[#f5f5f5] transition cursor-pointer select-none"
              @click="toggleWarga(w.id)">
              <img :src="w.foto_path ? getImageUrl(w.foto_path) : profileDefault"
                class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mr-3 border" alt="foto" />
              <div class="flex-1">
                <div class="font-medium text-[#232360] text-sm md:text-base">{{ w.nama }}</div>
                <div class="text-xs md:text-sm text-[#2e5eaa]">{{ w.no_hp }}</div>
              </div>
              <label class="inline-flex items-center">
                <input type="checkbox" class="hidden" :checked="selected.includes(w.id)" tabindex="-1" readonly />
                <div class="w-5 h-5 md:w-6 md:h-6 rounded border border-gray-300 flex items-center justify-center cursor-pointer"
                  :class="selected.includes(w.id) ? 'bg-[#03BF8C]' : 'bg-white'" @click="toggleWarga(w.id)">
                  <svg v-if="selected.includes(w.id)" class="w-3 h-3 md:w-4 md:h-4 text-white" fill="none"
                    stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="3" fill="none" />
                  </svg>
                </div>
              </label>
            </div>
          </template>
          <template v-else>
            <div class="text-center text-gray-400 py-6">Tidak ada warga ditemukan</div>
          </template>
        </div>
      </div>
      <div class="mt-auto mb-4 mx-4 md:mx-8 lg:mx-16 xl:mx-24">
        <button
          class="w-full bg-[#00c48c] hover:bg-[#00b07b] text-white font-bold py-3 rounded-2xl text-base shadow transition"
          :disabled="selected.length === 0" @click="pilih">
          PILIH
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAllWarga } from '@/services/wargaService';
import { setAsetPenghuniData, getAsetPenghuniData } from '@/services/penghuniService';
import HeaderForm from '@/components/card/HeaderForm.vue';
import { getImageUrl } from '@/lib/axios.js';
import profileDefault from '@/assets/default_profile.jpg'

const router = useRouter();
const route = useRoute();
const wargaList = ref([]);
const selected = ref([]);
const search = ref('');

onMounted(async () => {
  const { data } = await getAllWarga();
  wargaList.value = data?.data || [];
  const existing = getAsetPenghuniData().map(p => p.warga_id);
  selected.value = [...existing];
});

function toggleWarga(id) {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter(x => x !== id);
  } else {
    selected.value.push(id);
  }
}

const filteredWarga = computed(() => {
  if (!search.value) return wargaList.value;
  return wargaList.value.filter(w =>
    w.nama.toLowerCase().includes(search.value.toLowerCase())
  );
});

function pilih() {
  let penghuni = getAsetPenghuniData();
  selected.value.forEach(id => {
    if (!penghuni.find(p => p.warga_id === id)) {
      const warga = wargaList.value.find(w => w.id === id);
      penghuni.push({ warga_id: id, nama: warga?.nama, aset_m_status_id: null });
    }
  });

  penghuni = penghuni.filter(p => selected.value.includes(p.warga_id));
  setAsetPenghuniData(penghuni);
  router.back();
}
</script>