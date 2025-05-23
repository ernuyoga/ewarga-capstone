<template>
  <div class="min-h-screen bg-[#f6f6f6]">
    <HeaderForm :title="'Tambah Penghuni'" @back="router.back" />
    <div class="bg-white rounded-xl mx-4 mt-4 p-4">
      <div class="mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Cari Nama ..."
          class="w-full border rounded px-3 py-2 text-sm"
        />
      </div>
      <div class="text-xs text-gray-500 mb-2">Daftar Warga</div>
      <div class="max-h-[400px] overflow-y-auto">
        <div
          v-for="w in filteredWarga"
          :key="w.id"
          class="flex items-center gap-2 py-2 border-b"
        >
          <img
            :src="w.foto_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(w.nama)"
            class="w-10 h-10 rounded-full object-cover"
            alt="foto"
          />
          <div class="flex-1">
            <div class="text-sm font-medium">{{ w.nama }}</div>
            <div class="text-xs text-gray-500">{{ w.no_hp }}</div>
          </div>
          <input
            type="checkbox"
            :checked="selected.includes(w.id)"
            @change="toggleWarga(w.id)"
            class="w-5 h-5"
          />
        </div>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 w-full px-4 pb-4 bg-transparent">
      <button
        class="w-full bg-[#00C48C] text-white py-3 rounded-full font-bold"
        @click="pilih"
      >
        PILIH
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAllWarga } from '@/services/wargaService';
import { setAsetPenghuniData, getAsetPenghuniData } from '@/services/penghuniService';
import HeaderForm from '@/components/card/HeaderForm.vue';

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