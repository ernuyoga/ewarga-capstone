// filepath: [SubmitButton.vue](http://_vscodecontentref_/0)
<template>
  <div class="px-2">
    <button v-bind="$attrs"
      class="w-full bg-[#03BF8C] text-white font-semibold py-3 rounded-full shadow-lg text-center mt-4 mb-4 text-base sm:text-lg md:text-xl"
      @click="$emit('submit')">
      {{ label }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "SIMPAN"
  }
});
defineEmits(['submit']);
</script>