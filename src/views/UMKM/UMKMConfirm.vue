<template>
    <div class="w-full min-h-screen flex flex-col bg-[#fafafa]">
        <HeaderForm title="Konfirmasi Data UMKM" @back="handleBack" />
        <StepperHeader step-label="2/2" title="Konfirmasi Data" subtitle="Selanjutnya: Selesai" />
        <Preview :show="showPreview" :src="previewSrc" @close="closePreview" />
        <PopupMessage :show="showSuccess" type="success" title="UMKM Berhasil Ditambah!"
            :text="`${formData.nama_usaha || '-'} telah berhasil ditambahkan!`" @close="handleSuccessClose" />

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
                    <div v-for="(foto, idx) in formData.fotos || []" :key="idx"
                        class="w-14 h-14 lg:w-16 lg:h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden cursor-pointer"
                        @click="openPreview(idx)">
                        <img v-if="foto.url" :src="foto.url" class="object-cover w-full h-full"
                            :alt="foto.file?.name || `Foto ${idx + 1}`" />
                        <span v-else class="text-gray-400 text-2xl"><i class="icon-image"></i></span>
                    </div>
                </div>
            </div>

            <!-- Kontak Usaha -->
            <div>
                <div class="text-xs md:text-sm text-gray-400 mb-1">Kontak Usaha</div>
                <div>
                    <ul class="text-sm md:text-base break-all whitespace-pre-line">
                        <li v-for="(kontak, idx) in formData.kontak || []" :key="idx">
                            <b>• {{ kontak.jenis }}:</b> {{ kontak.kontak }}
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

        <div class="flex gap-3 px-4 md:px-8 lg:px-16 xl:px-24 mt-4 mb-4">
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
import api from "@/lib/axios";
import { clearUmkmFormData } from "@/services/umkmService";
import { ref, onMounted, computed } from "vue";
import HeaderForm from "@/components/card/HeaderForm.vue";
import SubmitButton from "@/components/card/SubmitButton.vue";
import { useRouter } from "vue-router";
import { getUmkmFormData } from "@/services/umkmService";
import { getUmkmMaster } from "@/services/masterService";
import { getAllWarga } from "@/services/wargaService";
import StepperHeader from "@/components/card/StepperHeader.vue";
import L from '@/plugins/leaflet'
import Preview from "@/components/card/Preview.vue";
import PopupMessage from "@/components/shared/PopupMessage.vue";

const showPreview = ref(false);
const previewSrc = ref("");
const router = useRouter();
const formData = ref({});
const jenisList = ref([]);
const bentukList = ref([]);
const pemilikNames = ref([]);
const showSuccess = ref(false);

const mapUrl = computed(() => {
    if (formData.value.lokasi_lat && formData.value.lokasi_lng) {
        return `https://www.openstreetmap.org/export/embed.html?bbox=${formData.value.lokasi_lng - 0.001
            },${formData.value.lokasi_lat - 0.001},${formData.value.lokasi_lng + 0.001
            },${formData.value.lokasi_lat + 0.001}&layer=mapnik&marker=${formData.value.lokasi_lat
            },${formData.value.lokasi_lng}`;
    }
    return "";
});

onMounted(async () => {
    formData.value = getUmkmFormData();
    // Ambil master untuk mapping nama jenis & bentuk
    const { data } = await getUmkmMaster();
    jenisList.value = data?.data?.jenis || [];
    bentukList.value = data?.data?.bentuk || [];

    // Ambil nama pemilik dari master warga
    if (formData.value.pemilik_ids && formData.value.pemilik_ids.length > 0) {
        try {
            const wargaRes = await getAllWarga();
            const wargaList = wargaRes?.data?.data || [];
            pemilikNames.value = formData.value.pemilik_ids.map((id) => {
                const found = wargaList.find((w) => w.id == id);
                return found ? found.nama : `ID ${id}`;
            });
        } catch {
            pemilikNames.value = formData.value.pemilik_ids.map((id) => `ID ${id}`);
        }
    }

    // Tampilkan peta lokasi jika tersedia
    if (formData.value.lokasi_lat && formData.value.lokasi_lng) {
        const map = L.map('map').setView([formData.value.lokasi_lat, formData.value.lokasi_lng], 16)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        L.marker([formData.value.lokasi_lat, formData.value.lokasi_lng]).addTo(map)
    }

});

const previewIdx = ref(null);

function openPreview(idx) {
    previewSrc.value = formData.value.fotos[idx]?.url || "";
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
    router.push({ name: "addumkm" });
}

function handleSuccessClose() {
    showSuccess.value = false;
    router.push({ name: "dashboard-umkm" });
}

async function handleSubmit() {
    try {
        // Ambil data dari formData
        const fd = new FormData();
        fd.append("nama", formData.value.nama_usaha);
        fd.append("instansi_id", 1); // Ganti sesuai kebutuhan
        fd.append("umkm_m_bentuk_id", formData.value.umkm_m_bentuk_id);
        fd.append("umkm_m_jenis_id", formData.value.umkm_m_jenis_id);
        fd.append("keterangan", formData.value.keterangan || "");
        fd.append("alamat", formData.value.alamat);

        // Lokasi
        fd.append("lokasi[0][latitude]", formData.value.lokasi_lat);
        fd.append("lokasi[0][longitude]", formData.value.lokasi_lng);

        // Pemilik/Warga
        if (
            formData.value.pemilik_ids &&
            Array.isArray(formData.value.pemilik_ids)
        ) {
            formData.value.pemilik_ids.forEach((id, idx) => {
                fd.append(`warga_ids[${idx}]`, id);
            });
        }

        // Kontak
        if (formData.value.kontak && Array.isArray(formData.value.kontak)) {
            formData.value.kontak.forEach((k, idx) => {
                fd.append(`kontak[${idx}][umkm_m_kontak_id]`, k.umkm_m_kontak_id);
                fd.append(`kontak[${idx}][kontak]`, k.kontak);
            });
        }

        // Foto
        if (formData.value.fotos && Array.isArray(formData.value.fotos)) {
            for (let i = 0; i < formData.value.fotos.length; i++) {
                const fotoObj = formData.value.fotos[i];
                // Jika upload base64, convert ke File dulu
                if (
                    fotoObj.url &&
                    fotoObj.file &&
                    fotoObj.file.name &&
                    fotoObj.file.type &&
                    fotoObj.url.startsWith("data:")
                ) {
                    const res = await fetch(fotoObj.url);
                    const blob = await res.blob();
                    const file = new File([blob], fotoObj.file.name, {
                        type: fotoObj.file.type,
                    });
                    fd.append(`fotos[${i}]`, file);
                }
            }
        }

        // POST ke API
        await api.post("/umkm", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        // Kosongkan localStorage
        clearUmkmFormData();
        showSuccess.value = true;
    } catch (err) {
        alert("Gagal simpan UMKM! Pastikan data sudah benar.");
        console.error(err);
    }
}
</script>
