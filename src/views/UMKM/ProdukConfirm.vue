<template>
    <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
        <HeaderForm title="Tambah Produk Baru" @back="goBack" />
        <Preview :show="showPreview" :src="previewSrc" @close="closePreview" />
        <PopupMessage :show="showSuccess" type="success" title="Produk Berhasil Ditambah!"
            :text="`Produk ${produkData.nama || '-'} telah berhasil ditambahkan!`" @close="handleSuccessClose" />

        <!-- StepperHeader -->
        <StepperHeader step-label="2/2" title="Konfirmasi Data" subtitle="Selanjutnya: Selesai" />

        <!-- Card Konfirmasi -->
        <div class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6 flex flex-col gap-4">
            <!-- Nama Produk -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Nama Produk</div>
                <div class="font-semibold text-[#232360] text-base md:text-lg">{{ produkData.nama }}</div>
            </div>
            <!-- Harga Produk -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Harga Produk</div>
                <div class="font-semibold text-[#232360] text-base md:text-lg">
                    Rp{{ Number(produkData.harga).toLocaleString('id-ID') }}
                </div>
            </div>
            <!-- Gambar Produk -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Gambar Produk</div>
                <div class="flex gap-2 flex-wrap">
                    <div v-for="(foto, idx) in produkData.fotos || []" :key="idx"
                        class="w-14 h-14 lg:w-16 lg:h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden cursor-pointer"
                        @click="openPreview(idx)">
                        <img v-if="foto.url" :src="foto.url" class="object-cover w-full h-full"
                            :alt="foto.file?.name || `Foto ${idx + 1}`" />
                        <span v-else class="text-gray-400 text-2xl"><i class="icon-image"></i></span>
                    </div>
                </div>
            </div>
            <!-- Keterangan -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Keterangan</div>
                <div class="whitespace-pre-line text-sm md:text-base">{{ produkData.keterangan || '-' }}</div>
            </div>
        </div>

        <!-- Tombol Ubah & Simpan -->
        <div class="flex gap-3 px-4 md:px-8 lg:px-16 xl:px-24 mt-4 mb-4">
            <button
                class="flex-1 font-semibold py-3 rounded-full text-center bg-white text-base md:text-lg border border-[#00c48c] text-[#00c48c] shadow-lg"
                @click="handleEdit">
                UBAH
            </button>
            <button
                class="flex-1 bg-[#00c48c] text-white font-semibold py-3 rounded-full text-center text-base md:text-lg hover:bg-[#029e71] transition-all"
                @click="handleSubmit">
                SIMPAN
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderForm from '@/components/card/HeaderForm.vue'
import StepperHeader from '@/components/card/StepperHeader.vue'
import Preview from '@/components/card/Preview.vue'
import PopupMessage from '@/components/shared/PopupMessage.vue'
import { useRouter } from 'vue-router'
import { getProdukFormData, setProdukFormData, clearProdukFormData, postProduk } from '@/services/produkService'
import { getWargaById } from "@/services/wargaService";
import { useAuthStore } from "@/store/auth";

const router = useRouter()
const produkData = ref({})
const auth = useAuthStore();
const instansiId = ref(null);
const showPreview = ref(false)
const previewSrc = ref('')
const showSuccess = ref(false)

onMounted(async () => {
    produkData.value = getProdukFormData()

    if (auth.user?.id && !produkData.value.instansi_id) {
        const resWarga = await getWargaById(auth.user.id);
        instansiId.value = resWarga.data.data?.instansi_id || null;
        setProdukFormData({ instansi_id: instansiId.value });
        produkData.value = getProdukFormData()
    }
})

function goBack() {
    router.back()
}

function handleEdit() {
    router.push({ name: 'addproduk' })
}

function openPreview(idx) {
    previewSrc.value = produkData.value.fotos[idx]?.url || ''
    showPreview.value = true
}

function closePreview() {
    showPreview.value = false
}

function handleSuccessClose() {
    showSuccess.value = false
    router.push({ name: 'umkm-detail', params: { id: produkData.value.umkm_id } })
}

async function handleSubmit() {
    const fd = new FormData()
    fd.append('nama', produkData.value.nama)
    fd.append('harga', produkData.value.harga)
    fd.append('keterangan', produkData.value.keterangan || '')
    fd.append('umkm_id', produkData.value.umkm_id)
    fd.append('instansi_id', produkData.value.instansi_id)

    if (produkData.value.fotos && Array.isArray(produkData.value.fotos)) {
        for (let i = 0; i < produkData.value.fotos.length; i++) {
            const fotoObj = produkData.value.fotos[i]
            if (
                fotoObj.url &&
                fotoObj.file &&
                fotoObj.file.name &&
                fotoObj.file.type &&
                fotoObj.url.startsWith('data:')
            ) {
                const res = await fetch(fotoObj.url)
                const blob = await res.blob()
                const file = new File([blob], fotoObj.file.name, { type: fotoObj.file.type })
                fd.append(`fotos[${i}]`, file)
            }
        }
    }

    try {
        await postProduk(fd)
        clearProdukFormData()
        showSuccess.value = true
    } catch (e) {
        if (e.response && e.response.data) {
            alert('Gagal menyimpan produk:\n' + JSON.stringify(e.response.data.errors || e.response.data, null, 2))
        } else {
            alert('Gagal menyimpan produk. Pastikan data sudah benar.')
        }
    }
}
</script>