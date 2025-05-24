<template>
    <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
        <HeaderForm title="Konfirmasi Edit Data UMKM" @back="handleBack" />
        <Preview :show="showPreview" :src="previewSrc" @close="closePreview" />
        <PopupMessage :show="showSuccess" :text="`${formData.nama_usaha || '-'} telah berhasil diubah!`"
            title="Data UMKM Berhasil diubah" type="success" @close="handleSuccessClose" />

        <!-- Stepper & Judul -->
        <StepperHeader step-label="2/2" title="Konfirmasi Data" subtitle="Selanjutnya: Selesai" />

        <div class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 p-4 md:p-6 flex flex-col gap-4">
            <!-- Nama Usaha -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Nama Usaha</div>
                <div class="font-semibold text-[#232360] text-base md:text-lg">
                    {{ formData.nama_usaha }}
                </div>
            </div>
            <!-- Moda Usaha -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Moda Usaha</div>
                <div class="text-sm md:text-base">{{ getJenisNama(formData.umkm_m_jenis_id) }}</div>
            </div>
            <!-- Bentuk Usaha -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Bentuk Usaha</div>
                <div class="text-sm md:text-base">{{ getBentukNama(formData.umkm_m_bentuk_id) }}</div>
            </div>
            <!-- Pemilik Usaha -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Pemilik Usaha</div>
                <ul class="list-disc ml-5 text-sm md:text-base">
                    <li v-for="(pemilik, idx) in pemilikNames" :key="idx">
                        {{ pemilik }}
                    </li>
                </ul>
            </div>
            <!-- Lokasi Usaha -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Lokasi Usaha</div>
                <div class="rounded-xl overflow-hidden mb-2" style="height: 200px">
                    <div id="map" style="height: 200px" :style="{ zIndex: previewIdx === null ? 10 : 0 }"></div>
                </div>
                <div class="text-sm md:text-base">{{ formData.alamat }}</div>
            </div>
            <!-- Gambar Usaha -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Gambar Usaha</div>
                <div class="flex gap-2 flex-wrap">
                    <div v-for="(foto, idx) in formData.gambar || []" :key="idx"
                        class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden cursor-pointer"
                        @click="openPreview(idx)">
                        <img v-if="foto.file_path" :src="`https://api.ewarga.rionaru.site/storage/${foto.file_path}`"
                            class="object-cover w-full h-full"
                            :alt="foto.file?.name || foto.nama || `Foto ${idx + 1}`" />
                        <img v-else-if="foto.url" :src="foto.url" class="object-cover w-full h-full"
                            :alt="foto.file?.name || `Foto ${idx + 1}`" />
                        <span v-else class="text-gray-400 text-2xl"><i class="icon-image"></i></span>
                    </div>
                </div>
            </div>

            <!-- Kontak Usaha -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Kontak Usaha</div>
                <div>
                    <ul class="text-sm md:text-base">
                        <li v-for="(kontak, idx) in formData.kontak || []" :key="idx">
                            <b>• {{ getJenisKontakNama(kontak.umkm_m_kontak_id) }}:</b> {{ kontak.kontak }}
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Keterangan -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Keterangan</div>
                <div class="whitespace-pre-line text-sm md:text-base">{{ formData.keterangan }}</div>
            </div>
        </div>

        <div class="flex gap-3 px-4 md:px-8 lg:px-16 xl:mx-24 mt-4 mb-4">
            <button
                class="flex-1 font-semibold py-3 rounded-full text-center bg-white text-base md:text-lg border border-[#00c48c] text-[#00c48c] shadow-lg mt-4 mb-4"
                @click="handleEdit">
                UBAH
            </button>
            <SubmitButton class="flex-1" label="SIMPAN" @submit="handleSubmit" />
        </div>
    </div>
</template>

<script setup>
import { clearEditUmkmFormData, getEditUmkmFormData } from "@/services/umkmService";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getUmkmMaster } from "@/services/masterService";
import { getAllWarga } from "@/services/wargaService";
import { updateUmkm } from "@/services/umkmService";
import HeaderForm from "@/components/card/HeaderForm.vue";
import SubmitButton from "@/components/card/SubmitButton.vue";
import Preview from "@/components/card/Preview.vue";
import StepperHeader from "@/components/card/StepperHeader.vue";
import PopupMessage from "@/components/shared/PopupMessage.vue";
import L from '@/plugins/leaflet'

const router = useRouter();
const route = useRoute();
const formData = ref({});
const jenisList = ref([]);
const bentukList = ref([]);
const kontakList = ref([]);
const pemilikNames = ref([]);
const showPreview = ref(false);
const previewSrc = ref("");
const showSuccess = ref(false);

onMounted(async () => {
    formData.value = getEditUmkmFormData();
    const { data } = await getUmkmMaster();
    jenisList.value = data?.data?.jenis || [];
    bentukList.value = data?.data?.bentuk || [];
    kontakList.value = data?.data?.kontak || [];

    if (formData.value.pemilik && formData.value.pemilik.length > 0) {
        try {
            const wargaRes = await getAllWarga();
            const wargaList = wargaRes?.data?.data || [];
            pemilikNames.value = formData.value.pemilik.map((id) => {
                const found = wargaList.find((w) => w.id == id);
                return found ? found.nama : `ID ${id}`;
            });
        } catch {
            pemilikNames.value = formData.value.pemilik.map((id) => `ID ${id}`);
        }
    }

    if (formData.value.lokasi_lat && formData.value.lokasi_lng) {
        const map = L.map('map').setView([formData.value.lokasi_lat, formData.value.lokasi_lng], 16)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        L.marker([formData.value.lokasi_lat, formData.value.lokasi_lng]).addTo(map)
    }
});

function getJenisKontakNama(id) {
    const found = kontakList.value.find((k) => k.id == id);
    return found ? found.nama : "-";
}
const previewIdx = ref(null);

function openPreview(idx) {
    const foto = formData.value.gambar[idx];
    if (foto?.url) {
        previewSrc.value = foto.url;
    } else if (foto?.file_path) {
        previewSrc.value = `https://api.ewarga.rionaru.site/storage/${foto.file_path}`;
    } else {
        previewSrc.value = "";
    }
    showPreview.value = true;
}
function closePreview() {
    showPreview.value = false;
}

function getJenisNama(id) {
    const found = jenisList.value.find((j) => j.id == id);
    return found ? found.nama : "-";
}
function getBentukNama(id) {
    const found = bentukList.value.find((b) => b.id == id);
    return found ? found.nama : "-";
}

function handleBack() {
    router.back();
}

function handleEdit() {
    router.push({ name: "umkmedit", params: { id: route.params.id } });
}

function handleSuccessClose() {
    showSuccess.value = false;
    router.push({ name: "dashboard-umkm" });
}

async function handleSubmit() {
    try {
        const fd = new FormData();
        fd.append("nama", formData.value.nama_usaha);
        fd.append("instansi_id", formData.value.instansi_id);
        fd.append("umkm_m_bentuk_id", formData.value.umkm_m_bentuk_id);
        fd.append("umkm_m_jenis_id", formData.value.umkm_m_jenis_id);
        fd.append("keterangan", formData.value.keterangan || "");
        fd.append("alamat", formData.value.alamat);

        fd.append("lokasi[0][latitude]", formData.value.lokasi_lat);
        fd.append("lokasi[0][longitude]", formData.value.lokasi_lng);

        if (
            formData.value.pemilik &&
            Array.isArray(formData.value.pemilik)
        ) {
            formData.value.pemilik.forEach((id, idx) => {
                fd.append(`warga_ids[${idx}]`, id);
            });
        }

        if (formData.value.kontak && Array.isArray(formData.value.kontak)) {
            formData.value.kontak.forEach((k, idx) => {
                fd.append(`kontak[${idx}][umkm_m_kontak_id]`, k.umkm_m_kontak_id);
                fd.append(`kontak[${idx}][kontak]`, k.kontak);
            });
        }

        if (formData.value.gambar && Array.isArray(formData.value.gambar)) {
            let fotoIdx = 0;
            for (let i = 0; i < formData.value.gambar.length; i++) {
                const fotoObj = formData.value.gambar[i];
                if (!fotoObj.id && fotoObj.url && fotoObj.file && fotoObj.file.name && fotoObj.file.type && fotoObj.url.startsWith("data:")) {
                    const res = await fetch(fotoObj.url);
                    const blob = await res.blob();
                    const file = new File([blob], fotoObj.file.name, { type: fotoObj.file.type });
                    fd.append(`fotos[${fotoIdx}]`, file);
                    fotoIdx++;
                }
            }
        }

        if (formData.value.hapus_foto && Array.isArray(formData.value.hapus_foto)) {
            formData.value.hapus_foto.forEach((id, idx) => {
                fd.append(`hapus_foto[${idx}]`, id);
            });
        }

        await updateUmkm(route.params.id, fd);

        clearEditUmkmFormData();
        showSuccess.value = true;
    } catch (err) {
        alert("Gagal simpan perubahan UMKM! Pastikan data sudah benar.");
        console.error(err);
    }
}
</script>