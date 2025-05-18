<template>
    <header class="flex items-center px-4 py-4 border-b border-gray-200 bg-white">
        <button @click="$emit('back')" class="mr-2 text-2xl text-gray-500 bg-transparent border-none p-0">
            &lt;
        </button>
        <h2 class="text-lg font-semibold text-gray-800">{{ title }}</h2>
    </header>
</template>

<script setup>
defineProps({ title: String });
defineEmits(['back']);
</script>