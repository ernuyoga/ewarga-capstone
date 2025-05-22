<template>
    <div
        class="bg-white rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 mt-4 px-4 py-2 lg:py-4 flex items-center justify-between">
        <div class="flex flex-col items-center">
            <div class="w-16 h-16 p-4 rounded-full bg-[#F0FFFB] flex items-center justify-center">
                <span class="text-xl font-semibold text-[#03BF8C]">{{ stepLabel }}</span>
            </div>
        </div>
        <div class="flex-1 ml-4 flex flex-col items-end">
            <div class="text-lg lg:text-xl font-semibold text-[#232360]">{{ title }}</div>
            <div class="text-sm lg:text-base text-gray-400">{{ subtitle }}</div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    stepLabel: { type: String, default: '' },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' }
});
</script>