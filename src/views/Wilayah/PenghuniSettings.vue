<template>
    <div class="min-h-screen bg-[#f6f6f6] pb-24">
        <HeaderForm title="Tambah Status Penghuni Objek" @back="router.back()" />
        <div class="bg-white rounded-xl mx-4 mt-4 p-4">
            <div class="flex items-start gap-2 mb-4 bg-[#E3F2FD] rounded p-3">
                <div class="text-[#2196F3] mt-1">
                    <i class="fa fa-info-circle"></i>
                </div>
                <div class="text-xs text-[#2196F3]">
                    Tiap objek dapat memiliki beberapa penghuni.<br>
                    Penghuni aset harus merupakan warga yang sudah terdaftar di aplikasi.
                </div>
            </div>
            <div v-if="penghuniList.length === 0" class="flex flex-col items-center py-8">
                <button @click="tambahPenghuni" class="text-[#00C48C] flex items-center gap-2 font-medium">
                    <i class="fa fa-plus"></i> Tambah Penghuni
                </button>
            </div>
            <div v-else>
                <div v-for="(p, idx) in penghuniList" :key="p.warga_id" class="flex items-center gap-2 mb-2">
                    <div class="w-full flex-col items-center gap-2">
                        <div class="flex items-center bg-[#F6F6F6] rounded px-3 py-2 flex-1">
                            <i class="fa fa-user text-gray-400 mr-2"></i>
                            <span class="text-sm font-medium">{{ p.nama || 'Nama Penghuni' }}</span>
                        </div>
                        <div v-if="!p.aset_m_status_id" class="text-xs text-red-500 ml-8 mb-2">
                            Status Penghuni Wajib Dilengkapi
                        </div>
                    </div>
                    <select class="border rounded px-2 py-2 text-sm min-w-[140px] bg-white" v-model="p.aset_m_status_id"
                        @change="ubahStatus(idx, p.aset_m_status_id)">
                        <option value="" disabled>Status Penghuni</option>
                        <option v-for="s in statusList" :key="s.id" :value="s.id">{{ s.nama }}</option>
                    </select>
                    <button @click="hapusPenghuni(idx)"
                        class="text-red-500 text-lg flex items-center justify-center h-10 w-10 hover:bg-red-50 rounded-full transition"
                        title="Hapus">
                        <i class="fa fa-times">X</i>
                    </button>
                </div>
                <button @click="tambahPenghuni" class="text-[#00C48C] flex items-center gap-2 mt-4 font-medium mx-auto"
                    style="width: fit-content;">
                    <i class="fa fa-plus">+</i> Tambah Penghuni
                </button>
            </div>
        </div>
        <div class="fixed bottom-0 left-0 w-full px-4 pb-4 bg-transparent">
            <button class="w-full bg-[#00C48C] text-white py-3 rounded-full font-bold text-base"
                :disabled="!bolehSimpan" @click="simpanPenghuni">
                SIMPAN
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { setAsetPenghuniData, getAsetPenghuniData, clearAsetPenghuniData } from '@/services/penghuniService';
import { getAsetMaster } from '@/services/masterService';
import { updateAsetPenghuni } from '@/services/penghuniService';
import HeaderForm from '@/components/card/HeaderForm.vue';

const route = useRoute();
const router = useRouter();
const penghuniList = ref([]);
const statusList = ref([]);
const initialPenghuni = ref([]);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    try {
        const masterRes = await getAsetMaster();
        statusList.value = masterRes?.data?.data?.status || [];
        const data = getAsetPenghuniData();
        penghuniList.value = Array.isArray(data) ? data : [];
        initialPenghuni.value = JSON.parse(JSON.stringify(penghuniList.value));
    } catch (error) {
    }
    loading.value = false;
});

function tambahPenghuni() {
    router.push({ name: 'penghuniadd', params: { id: route.params.id } });
}

function hapusPenghuni(idx) {
    penghuniList.value.splice(idx, 1);
    setAsetPenghuniData(penghuniList.value);
}

function ubahStatus(idx, statusId) {
    penghuniList.value[idx].aset_m_status_id = statusId;
    setAsetPenghuniData(penghuniList.value);
}

const bolehSimpan = computed(() =>
    penghuniList.value.length > 0 &&
    penghuniList.value.every(p => !!p.aset_m_status_id)
);

async function simpanPenghuni() {
    if (!bolehSimpan.value) return;
    try {
        await updateAsetPenghuni(route.params.id, penghuniList.value);
        clearAsetPenghuniData();
        router.back();
    } catch (e) {
        alert('Gagal menyimpan data penghuni');
        if (e.response) {
            console.error('API Error:', e.response.data);
            alert(JSON.stringify(e.response.data));
        } else {
            console.error(e);
            alert(e.message);
        }
    }
}
</script>