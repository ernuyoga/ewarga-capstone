<template>
    <header class="px-4 py-4 border-b border-gray-200 bg-white">
        <div class="flex items-center justify-between">
            <!-- Kiri: tombol back & judul -->
            <div class="flex items-center min-w-0">
                <button @click="$emit('back')" class="mr-3 p-0 bg-transparent border-none flex-shrink-0">
                    <img :src="tombolKembali" alt="Back" class="w-6 h-6" />
                </button>
                <h2 class="text-lg font-semibold text-gray-800 truncate">
                    {{ title }}
                </h2>
            </div>
            <!-- Kanan: slot action -->
            <div class="flex-shrink-0 ml-4">
                <div class="w-8 h-8 flex items-center justify-center">
                    <slot name="action"></slot>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import tombolKembali from '@/assets/tombol_kembali.png';
defineProps({ title: String });
defineEmits(['back']);
</script>