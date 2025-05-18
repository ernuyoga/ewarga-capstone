<template>
  <div class="px-4">
    <button
      class="w-full bg-[#00c48c] text-white font-semibold py-3 rounded-full shadow-lg text-center mt-8 mb-4"
      @click="$emit('submit')"
    >
      SIMPAN
    </button>
  </div>
</template>

<script setup>
defineEmits(['submit']);
</script>