<!-- KontakForm.vue -->
<template>
    <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
        <HeaderForm title="Tambah Kontak Usaha" @back="handleBack" />

        <div class="flex-1 flex flex-col justify-between">
            <div>
                <div class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6">
                    <InfoAlert>
                        Kontak yang ditambahkan dapat berupa nomor telepon, nomor WhatsApp, akun sosial media
                        (Instagram, TikTok, Facebook), ataupun email.
                    </InfoAlert>

                    <!-- Daftar kontak -->
                    <div v-for="(item, idx) in kontakList" :key="idx"
                        class="flex items-center border border-gray-200 rounded-lg px-3 py-2 md:px-4 md:py-3 mb-3">
                        <span class="flex-1 text-sm md:text-base text-gray-800 truncate">
                            <b>{{ item.jenis }}</b>: {{ item.kontak }}
                        </span>
                        <button @click="removeKontak(idx)"
                            class="ml-2 text-gray-400 hover:text-red-500 text-lg md:text-xl" aria-label="Hapus">
                            &times;
                        </button>
                    </div>

                    <!-- Tombol tambah kontak -->
                    <div class="flex justify-center mt-2">
                        <button @click="showModal = true"
                            class="flex items-center gap-2 text-[#03BF8C] font-medium bg-transparent border-none p-1 rounded-lg transition text-base md:text-lg"
                            :disabled="kontakList.length >= 5">
                            <span class="text-xl md:text-2xl">+</span> Tambah Kontak
                        </button>
                    </div>
                </div>
            </div>
            <div class="mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 mb-4">
                <SubmitButton @submit="submitKontak" />
            </div>
        </div>

        <!-- Modal tambah kontak -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-4 md:p-6 w-[90vw] max-w-md">
                <div class="mb-3">
                    <label class="block text-sm md:text-base font-medium mb-1">Tipe Kontak</label>
                    <div class="relative">
                        <select v-model="selectedTipe" :class="[
                            'w-full border border-gray-200 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base appearance-none focus:outline-none focus:ring-1 focus:ring-[#03BF8C]',
                            selectedTipe ? 'text-[#232360]' : 'text-gray-400'
                        ]">
                            <option disabled value="" class="text-gray-400">Pilih Tipe Kontak</option>
                            <option v-for="tipe in tipeList" :key="tipe.id" :value="tipe.id" class="text-[#232360]">{{
                                tipe.nama }}</option>
                        </select>
                        <img src="@/assets/v_hitam.svg" alt="dropdown icon"
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
                <div class="mb-3">
                    <label class="block text-sm md:text-base font-medium mb-1">Kontak</label>
                    <input v-model="inputKontak" type="text" maxlength="100"
                        class="w-full border rounded-lg px-3 py-2 md:px-4 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C]"
                        placeholder="Masukkan Kontak Anda" />
                </div>
                <div class="flex gap-2 justify-end">
                    <button @click="showModal = false"
                        class="px-4 py-2 rounded-3xl bg-gray-200 text-sm md:text-base">Batal</button>
                    <button @click="addKontak" :disabled="!selectedTipe || !inputKontak"
                        class="px-4 py-2 rounded-3xl bg-[#03BF8C] text-white text-sm md:text-base">Tambah</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderForm from '../../components/card/HeaderForm.vue'
import SubmitButton from '../../components/card/SubmitButton.vue'
import InfoAlert from '@/components/card/InfoAlert.vue'
import { useRouter, useRoute } from 'vue-router'
import { getUmkmMaster } from "@/services/masterService"
import { setEditUmkmFormData, getEditUmkmFormData } from '@/services/umkmService'

const router = useRouter()
const route = useRoute()
const showModal = ref(false)
const tipeList = ref([])
const selectedTipe = ref("")
const inputKontak = ref("")
const kontakList = ref([])

onMounted(async () => {
    const { data } = await getUmkmMaster({ data: "kontak" })
    tipeList.value = data?.data?.kontak || []

    const formData = getEditUmkmFormData()
    kontakList.value = (formData.kontak || []).map(item => {
        const tipe = tipeList.value.find(t => t.id == item.umkm_m_kontak_id)
        return {
            ...item,
            jenis: item.jenis || (tipe ? tipe.nama : '')
        }
    })
})

function addKontak() {
    const tipe = tipeList.value.find(t => t.id == selectedTipe.value)
    if (!tipe) return
    kontakList.value.push({
        umkm_m_kontak_id: tipe.id,
        kontak: inputKontak.value,
        jenis: tipe.nama
    })
    setEditUmkmFormData({ kontak: kontakList.value })
    showModal.value = false
    selectedTipe.value = ""
    inputKontak.value = ""
}

function removeKontak(idx) {
    kontakList.value.splice(idx, 1)
    setEditUmkmFormData({ kontak: kontakList.value.map(({ jenis, ...rest }) => rest) })
}

function submitKontak() {
    setEditUmkmFormData({ kontak: kontakList.value.map(({ jenis, ...rest }) => rest) })
    router.push({ name: 'umkmedit', params: { id: route.params.id } })
}

function handleBack() {
    router.back()
}
</script>