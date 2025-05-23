<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full text-center relative">
      <button @click="close" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold">&times;</button>
      <div class="text-yellow-500 text-4xl mb-2">⚠️</div>
      <div class="text-gray-800 text-base mb-4">{{ message }}</div>
      <button @click="close" class="px-4 py-2 bg-[#00c48c] text-white rounded-lg font-semibold hover:bg-[#00b07b] transition">
        OK
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean,
  message: String
});
const emit = defineEmits(['close']);
function close() {
  emit('close');
}
</script>