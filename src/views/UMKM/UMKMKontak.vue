<!-- KontakForm.vue -->
<template>
    <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
        <HeaderForm title="Tambah Kontak Usaha" @back="handleBack" />

        <div class="flex-1 flex flex-col justify-between">
            <div>
                <div class="bg-white rounded-xl mx-4 mt-4 p-4">
                    <div class="bg-[#eaf4ff] rounded-xl px-4 py-3 flex items-start gap-2 mb-4">
                        <img src="/Info-Circle.svg" alt="info" class="w-5 h-5 mt-1" />
                        <span class="text-sm text-[#2e5eaa] leading-snug">
                            Kontak dapat berupa nomor telepon, sosial media, atau email. Maksimal 5 kontak.
                        </span>
                    </div>

                    <!-- Daftar kontak -->
                    <div v-for="(item, idx) in kontakList" :key="idx"
                        class="flex items-center border rounded-lg px-3 py-2 mb-3">
                        <span class="flex-1 text-sm text-gray-800 truncate">
                            <b>{{ item.jenis }}</b>: {{ item.kontak }}
                        </span>
                        <button @click="removeKontak(idx)" class="ml-2 text-gray-400 hover:text-red-500 text-lg"
                            aria-label="Hapus">
                            &times;
                        </button>
                    </div>

                    <!-- Tombol tambah kontak -->
                    <div class="flex justify-center mt-2">
                        <button @click="showModal = true"
                            class="flex items-center gap-2 text-[#00c48c] font-medium bg-transparent border-none py-2 px-4 rounded-lg hover:bg-[#e6faf5] transition"
                            :disabled="kontakList.length >= 5">
                            <span class="text-xl">+</span> Tambah Kontak
                        </button>
                    </div>
                </div>
            </div>
            <SubmitButton @submit="submitKontak" />
        </div>

        <!-- Modal tambah kontak -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl p-6 w-[90vw] max-w-md">
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-1">Tipe Kontak</label>
                    <select v-model="selectedTipe" class="w-full border rounded-lg px-3 py-2">
                        <option disabled value="">Pilih Tipe Kontak</option>
                        <option v-for="tipe in tipeList" :key="tipe.id" :value="tipe.id">{{ tipe.nama }}</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="block text-sm font-medium mb-1">Kontak</label>
                    <input v-model="inputKontak" type="text" maxlength="100" class="w-full border rounded-lg px-3 py-2"
                        placeholder="Masukkan Kontak Anda" />
                </div>
                <div class="flex gap-2 justify-end">
                    <button @click="showModal = false" class="px-4 py-2 rounded bg-gray-200">Batal</button>
                    <button @click="addKontak" :disabled="!selectedTipe || !inputKontak"
                        class="px-4 py-2 rounded bg-[#00c48c] text-white">Tambah</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HeaderForm from '../../components/card/HeaderForm.vue'
import SubmitButton from '../../components/card/SubmitButton.vue'
import { useRouter } from 'vue-router'
import { getUmkmMaster } from "@/services/masterService"
import { setUmkmFormData, getUmkmFormData } from '@/services/umkmService'

const router = useRouter()
const showModal = ref(false)
const tipeList = ref([])
const selectedTipe = ref("")
const inputKontak = ref("")
const kontakList = ref([])

onMounted(async () => {
    const { data } = await getUmkmMaster({ data: "kontak" })
    tipeList.value = data?.data?.kontak || []

    const formData = getUmkmFormData()
    kontakList.value = formData.kontak || []
})

function addKontak() {
    const tipe = tipeList.value.find(t => t.id == selectedTipe.value)
    if (!tipe) return
    kontakList.value.push({
        umkm_m_kontak_id: tipe.id,
        kontak: inputKontak.value,
        jenis: tipe.nama
    })
    setUmkmFormData({ kontak: kontakList.value })
    showModal.value = false
    selectedTipe.value = ""
    inputKontak.value = ""
}

function removeKontak(idx) {
    kontakList.value.splice(idx, 1)
    setUmkmFormData({ kontak: kontakList.value })
}

function submitKontak() {
    setUmkmFormData({ kontak: kontakList.value })
    router.push({ name: 'addumkm' })
}

function handleBack() {
    router.push({ name: 'addumkm' })
}
</script>