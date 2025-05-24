<template>
    <div class="min-h-screen bg-[#f6f6f6]">
        <!-- Header -->
        <HeaderForm title="Penghuni Objek" @back="goBack" />

        <!-- Container -->
        <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24">
            <!-- Search -->
            <div class="py-4">
                <div class="relative">
                    <input v-model="search" type="text" placeholder="Cari nama penghuni..."
                        class="w-full border rounded-lg px-6 py-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-gray-100" />
                    <i class="icon-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </div>
            </div>

            <!-- List Penghuni -->
            <div class="bg-white rounded-xl shadow px-4 md:px-8 py-4">
                <div v-for="(penghuni, index) in filteredPenghuni" :key="index"
                    class="flex items-center gap-3 mb-4 last:mb-0">
                    <!-- gambar penghuni -->
                    <img :src="getImageUrl(penghuni.foto_path)" class="w-12 h-12 rounded-full object-cover border"
                        :alt="penghuni.nama" @error="onImgError($event)" />
                    <div class="text-sm lg:text-base">
                        <div class="font-semibold text-base lg:text-lg">{{ penghuni.nama }}</div>
                        <div class="text-gray-500">{{ penghuni.status }}</div>
                        <div class="text-blue-600">{{ penghuni.no_tlp || '—' }}</div>
                    </div>
                </div>
                <div v-if="filteredPenghuni.length === 0" class="text-center text-gray-400 py-6 text-sm lg:text-base">
                    Tidak ada penghuni.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPenghuniByAset } from '@/services/penghuniService';
import HeaderForm from '@/components/card/HeaderForm.vue';
import { getImageUrl } from '@/lib/axios.js';

const route = useRoute();
const router = useRouter();
const penghuniList = ref([]);
const search = ref('');
const fotoDefault = 'https://via.placeholder.com/150';

function goBack() {
    router.back();
}

const filteredPenghuni = computed(() => {
    if (!search.value) return penghuniList.value;
    return penghuniList.value.filter(p =>
        p.nama?.toLowerCase().includes(search.value.toLowerCase())
    );
});

function onImgError(e) {
    e.target.src = fotoDefault;
}

onMounted(async () => {
    const id = route.params.id;
    if (!id) return;
    try {
        const penghuniRes = await getPenghuniByAset(id);
        if (penghuniRes && penghuniRes.data) {
            penghuniList.value = penghuniRes.data.map(item => ({
                ...item.warga,
                status: item.status?.nama || '-'
            }));
        }
    } catch (error) {
        console.error(error);
    }
});
</script>