<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white rounded-xl shadow-lg p-6 m-4 max-w-sm w-full">
            <div class="mb-4">
                <slot name="title">
                    <div class="text-lg font-bold mb-2">Konfirmasi</div>
                </slot>
                <slot />
            </div>
            <div class="flex justify-end gap-2">
                <button @click="$emit('cancel')" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Batal</button>
                <button @click="$emit('confirm')"
                    class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Hapus</button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    show: Boolean
});
</script>