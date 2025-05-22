<template>
    <header class="px-6 lg:px-24 py-3 lg:py-4 border-b border-gray-200 bg-white">
        <div class="flex items-center justify-between">
            <!-- Kiri: tombol back & judul -->
            <div class="flex items-center min-w-0">
                <button @click="$emit('back')" class="mr-3 md:mr-4 p-0 bg-transparent border-none flex-shrink-0">
                    <img :src="tombolKembali" alt="Back" class="w-4 h-4" />
                </button>
                <h2 class="text-lg lg:text-xl font-bold text-gray-800 truncate">
                    {{ title }}
                </h2>
            </div>
            <!-- Kanan: slot action -->
            <div class="flex-shrink-0 ml-4 md:ml-6">
                <div class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
                    <slot name="action"></slot>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import tombolKembali from '@/assets/tombol_kembali.svg';
defineProps({ title: String });
defineEmits(['back']);
</script>