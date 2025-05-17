<template>
    <div class="container">
        <div class="card">
            <h1 class="title">Lengkapi Profil</h1>
            <div class="form-group">
                <select v-model="instansi_id" class="input">
                    <option value="" disabled>Pilih Instansi</option>
                    <option v-for="instansi in instansiList" :key="instansi.id" :value="instansi.id">
                        {{ instansi.nama }} - RT {{ instansi.rt }} / RW {{ instansi.rw }}
                    </option>
                </select>
                <input v-model="nama" type="text" placeholder="Nama Lengkap"
                    class="input bg-gray-100 cursor-not-allowed" readonly />
                <input v-model="nik" type="text" placeholder="NIK" class="input" />
                <input v-model="no_kk" type="text" placeholder="No KK" class="input" />
                <input v-model="no_tlp" type="text" placeholder="No Telepon" class="input" />
                <input v-model="tempat_lahir" type="text" placeholder="Tempat Lahir" class="input" />
                <input v-model="tgl_lahir" type="date" class="input" />
                <select v-model="jenis_kelamin" class="input">
                    <option value="" disabled>Pilih Jenis Kelamin</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                </select>
                <textarea v-model="alamat" placeholder="Alamat Lengkap" class="input"></textarea>
                <button @click="submitForm" class="button">Simpan Profil</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { registerWarga as registerWargaApi } from "@/services/authService";
import { getAllInstansi } from "@/services/instansiService";

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

const submitForm = async () => {
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
        } else if (res?.message) {
            message = res.message
        }

        alert(message)
    }
};
</script>

<style scoped>
.container {
    @apply min-h-screen flex items-center justify-center bg-gray-100;
}

.card {
    @apply bg-white shadow-lg rounded-xl p-8 w-full max-w-md;
}

.title {
    @apply text-2xl font-semibold text-center text-gray-700 mb-6;
}

.form-group {
    @apply space-y-4;
}

.input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400;
}

.button {
    @apply w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200;
}
</style>