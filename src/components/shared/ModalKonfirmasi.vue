<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-xl shadow-lg p-6 m-4 max-w-sm w-full relative">
      <div class="flex flex-col items-center">
        <slot name="title">
          <div class="text-lg font-bold mb-2 text-[#2B2350] text-center">Konfirmasi Logout</div>
        </slot>
        <slot />
      </div>
      <div class="flex justify-center gap-4 mt-6">
        <button @click="$emit('cancel')"
          class="px-8 py-2 rounded-full bg-[#E94964] text-white font-bold hover:bg-[#d93c4e] transition-all">
          BATAL
        </button>
        <button @click="$emit('confirm')"
          class="px-8 py-2 rounded-full border border-[#E94964] text-[#E94964] font-bold bg-white hover:bg-[#fbeaec] transition-all">
          LOGOUT
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean
});
</script>