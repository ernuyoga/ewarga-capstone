<template>
    <div class="min-h-screen bg-[#f6f6f6] flex items-center justify-center relative overflow-hidden">
        <!-- PopupMessage -->
        <PopupMessage :show="showPopup" type="warning" title="Gagal Simpan Profil" :text="popupText"
            @close="showPopup = false" />

        <div class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 my-8 p-4 md:p-6 w-full max-w-md z-10">
            <h1 class="text-2xl font-bold text-center text-[#03BF8C] mb-6">Lengkapi Profil</h1>
            <form @submit.prevent="submitForm" class="flex flex-col gap-3">
                <div>
                    <label class="block text-sm font-medium text-[#232360] mb-1">Instansi</label>
                    <div class="relative">
                        <select v-model="instansi_id"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base appearance-none focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50 pr-10">
                            <option value="" disabled>Pilih Instansi</option>
                            <option v-for="instansi in instansiList" :key="instansi.id" :value="instansi.id">
                                {{ instansi.nama }} - RT {{ instansi.rt }} / RW {{ instansi.rw }}
                            </option>
                        </select>
                        <img src="@/assets/v_hitam.svg" alt="dropdown"
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-[#232360] mb-1">Nama Lengkap</label>
                    <input v-model="nama" type="text" readonly
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-100 cursor-not-allowed" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-[#232360] mb-1">NIK</label>
                    <input v-model="nik" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="16"
                        placeholder="NIK" @input="nik = nik.replace(/\D/g, '').slice(0, 16)"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-[#232360] mb-1">No KK</label>
                    <input v-model="no_kk" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="16"
                        placeholder="No KK" @input="no_kk = no_kk.replace(/\D/g, '')"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-[#232360] mb-1">No Telepon</label>
                    <input v-model="no_tlp" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="13"
                        placeholder="No Telepon" @input="no_tlp = no_tlp.replace(/\D/g, '')"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-[#232360] mb-1">Tempat Lahir</label>
                    <input v-model="tempat_lahir" type="text" placeholder="Tempat Lahir"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-[#232360] mb-1">Tanggal Lahir</label>
                    <input v-model="tgl_lahir" type="date"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-[#232360] mb-1">Jenis Kelamin</label>
                    <div class="relative">
                        <select v-model="jenis_kelamin"
                            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base appearance-none focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50 pr-10">
                            <option value="" disabled>Pilih Jenis Kelamin</option>
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                        <img src="@/assets/v_hitam.svg" alt="dropdown"
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-[#232360] mb-1">Alamat Lengkap</label>
                    <textarea v-model="alamat" placeholder="Alamat Lengkap"
                        class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50 resize-none"></textarea>
                </div>
                <div class="mt-2">
                    <button type="submit"
                        class="w-full bg-[#03BF8C] hover:bg-[#029e73] text-white py-3 rounded-lg font-semibold text-base transition duration-200">
                        Simpan Profil
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { registerWarga as registerWargaApi } from "@/services/authService";
import { getAllInstansi } from "@/services/instansiService";
import PopupMessage from "@/components/shared/PopupMessage.vue";

const router = useRouter();
const route = useRoute();

const instansi_id = ref("");
const instansiList = ref([]);
const nama = ref("");
const nik = ref("");
const no_kk = ref("");
const no_tlp = ref("");
const tempat_lahir = ref("");
const tgl_lahir = ref("2000-01-01");
const jenis_kelamin = ref("");
const alamat = ref("");

const showPopup = ref(false);
// Ubah popupText menjadi array agar bisa digunakan sebagai list
const popupText = ref([]);

onMounted(async () => {
    if (route.query.nama) {
        nama.value = route.query.nama;
    }
    try {
        const res = await getAllInstansi();
        instansiList.value = res.data.data || [];
    } catch (e) {
        instansiList.value = [];
    }
});

const fieldLabels = {
    instansi_id: "Instansi",
    nama: "Nama Lengkap",
    nik: "NIK",
    no_kk: "No KK",
    no_tlp: "No Telepon",
    tempat_lahir: "Tempat Lahir",
    tgl_lahir: "Tanggal Lahir",
    jenis_kelamin: "Jenis Kelamin",
    alamat: "Alamat Lengkap"
};

const submitForm = async () => {
    // Cek field kosong
    const emptyFields = Object.entries({
        instansi_id: instansi_id.value,
        nama: nama.value,
        nik: nik.value,
        no_kk: no_kk.value,
        no_tlp: no_tlp.value,
        tempat_lahir: tempat_lahir.value,
        tgl_lahir: tgl_lahir.value,
        jenis_kelamin: jenis_kelamin.value,
        alamat: alamat.value
    }).filter(([_, v]) => !v);

    if (emptyFields.length > 0) {
        popupText.value = emptyFields.map(([k]) => `${fieldLabels[k]} wajib diisi`);
        showPopup.value = true;
        return;
    }
    try {
        await registerWargaApi({
            instansi_id: instansi_id.value,
            nama: nama.value,
            nik: nik.value,
            no_kk: no_kk.value,
            no_tlp: no_tlp.value,
            tempat_lahir: tempat_lahir.value,
            tgl_lahir: tgl_lahir.value,
            jenis_kelamin: jenis_kelamin.value,
            alamat: alamat.value,
        });
        router.push("/");
    } catch (err) {
        const res = err.response?.data

        let message = 'Gagal menyimpan data'

        if (res?.kode === 422 && res?.data) {
            const errorMessages = Object.values(res.data).flat()
            message = errorMessages.join('\n')
            popupText.value = [message]
        } else if (res?.message) {
            message = res.message
            popupText.value = [message]
        } else {
            popupText.value = [message]
        }

        showPopup.value = true;
    }
};
</script>