<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        @click.self="close">
        <div class="bg-white rounded-xl shadow-lg p-4 relative w-[320px] h-[280px] lg:w-[600px] lg:h-[400px] max-w-[600px] max-h-[400px] flex items-center justify-center">
            <div class="relative w-full h-full">
                <button @click="close"
                    class="absolute top-1 right-0 z-10 text-gray-500 hover:text-gray-700 text-2xl">
                    <img src="@/assets/x_icon.svg" alt="Tutup" class="w-4 h-4" />
                </button>
                <div class="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg overflow-hidden">
                    <img :src="src" alt="Preview" class="object-contain w-full h-full" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    show: Boolean,
    src: String
});
const emit = defineEmits(['close']);
function close() {
    emit('close');
}
</script>