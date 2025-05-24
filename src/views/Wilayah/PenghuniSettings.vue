<template>
    <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
        <HeaderForm title="Tambah Status Penghuni Objek" @back="router.back()" />

        <div class="flex-1 flex flex-col">
            <div class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6">
                <InfoAlert>
                    Tiap objek dapat memiliki beberapa penghuni.
                    Penghuni aset harus merupakan warga yang sudah terdaftar di aplikasi.
                </InfoAlert>

                <div class="font-semibold text-[#232360] mt-2 mb-2 text-base md:text-lg">Daftar Penghuni</div>
                <div class="flex flex-col gap-2 max-h-[420px] overflow-y-auto">
                    <template v-if="penghuniList.length">
                        <div v-for="(p, idx) in penghuniList" :key="p.warga_id"
                            class="flex flex-col items-end px-2 md:px-4 py-2 md:py-3 rounded-lg bg-[#f6f6f6] hover:bg-[#f5f5f5] transition select-none">
                            <div class="flex items-center w-full">
                                <img src="@/assets/orang.svg" class="w-4 h-4 lg:w-5 lg:h-5 object-contain mx-2"
                                    alt="foto" />
                                <div class="flex-1">
                                    <div class="font-medium text-[#232360] text-sm md:text-base">{{ p.nama }}</div>
                                </div>
                                <div class="relative">
                                    <select
                                        class="border rounded px-2 py-2 text-sm min-w-[140px] bg-white  appearance-none"
                                        v-model="p.aset_m_status_id" @change="ubahStatus(idx, p.aset_m_status_id)">
                                        <option value="" disabled>Status Penghuni</option>
                                        <option v-for="s in statusList" :key="s.id" :value="s.id">{{ s.nama }}</option>
                                    </select>
                                    <img src="@/assets/v_hitam.svg" alt="dropdown icon"
                                        class="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                                </div>
                                <button @click="hapusPenghuni(idx)"
                                    class="text-red-500 text-lg flex items-center justify-center h-10 w-10 rounded-full transition"
                                    title="Hapus">
                                    <span class="text-xl">&times;</span>
                                </button>
                            </div>
                            <div v-if="!p.aset_m_status_id" class="text-xs text-red-500 mt-1 pr-8">
                                Status Penghuni Wajib Dilengkapi
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="flex flex-col items-center py-8">
                            <button @click="tambahPenghuni" class="text-[#00C48C] flex items-center gap-2 font-medium">
                                <span class="text-xl">+</span> Tambah Penghuni
                            </button>
                        </div>
                    </template>
                </div>
                <button v-if="penghuniList.length" @click="tambahPenghuni"
                    class="text-[#00C48C] flex items-center gap-2 mt-4 font-medium mx-auto" style="width: fit-content;">
                    <span class="text-xl">+</span> Tambah Penghuni
                </button>
            </div>
            <div class="mt-auto mb-4 mx-4 md:mx-8 lg:mx-16 xl:mx-24">
                <button
                    class="w-full bg-[#00c48c] hover:bg-[#00b07b] text-white font-bold py-3 rounded-2xl text-base shadow transition"
                    :disabled="!bolehSimpan" @click="simpanPenghuni">
                    SIMPAN
                </button>
            </div>
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
import InfoAlert from '@/components/card/InfoAlert.vue'
import { getImageUrl } from '@/lib/axios.js';
import profileDefault from '@/assets/default_profile.jpg'

const route = useRoute();
const router = useRouter();
const penghuniList = ref([]);
const statusList = ref([]);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    try {
        const masterRes = await getAsetMaster();
        statusList.value = masterRes?.data?.data?.status || [];
        const data = getAsetPenghuniData();
        penghuniList.value = Array.isArray(data) ? data : [];
    } catch (error) { }
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