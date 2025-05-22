<template>
    <div class="bg-[#eaf4ff] rounded-xl px-4 py-3 flex items-start gap-2 mb-4">
        <img src="@/assets/info_icon.svg" alt="info" class="w-5 h-5" />
        <span class="text-sm md:text-base text-[#2e5eaa] leading-snug">
            <slot>{{ message }}</slot>
        </span>
    </div>
</template>

<script setup>
defineProps({
    message: {
        type: String,
        default: ''
    }
});
</script>