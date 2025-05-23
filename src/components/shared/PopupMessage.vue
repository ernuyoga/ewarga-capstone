<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full text-center relative">
      <button @click="close" class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold">
        <img src="@/assets/x_icon.svg" alt="Tutup" class="w-4 h-4" />
      </button>
      <div :class="type === 'success' ? 'text-green-500' : 'text-yellow-500'" class="text-4xl mb-2 flex justify-center">
        <img v-if="type === 'success'" src="@/assets/check_circle.svg" alt="Berhasil" class="w-20 h-20 mx-auto" />
        <span v-else>⚠️</span>
      </div>
      <div v-if="title" class="text-[#3b3969] text-lg font-bold mb-1">{{ title }}</div>
      <div v-if="Array.isArray(text)" class="text-[#6c6a8a] text-sm mb-4">
        <div v-if="listLabel" class="mb-1 font-semibold">{{ listLabel }}</div>
        <ul class="list-disc list-inside text-left ml-4">
          <li v-for="(item, idx) in text" :key="idx">{{ item }}</li>
        </ul>
      </div>
      <div v-else-if="text" class="text-[#6c6a8a] text-sm mb-4">{{ text }}</div>
      <SubmitButton :label="`OK (${countdown})`" @submit="close" class="w-full h-12 py-0 text-sm mx-0 mb-4" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import SubmitButton from '../card/SubmitButton.vue'

const props = defineProps({
  type: { type: String, default: 'warning' },
  show: Boolean,
  title: String,
  text: [String, Array],
  listLabel: String,
});
const emit = defineEmits(['close']);

const countdown = ref(5)
let timer = null

function close() {
  clearInterval(timer)
  emit('close')
}

watch(() => props.show, (val) => {
  if (val) {
    countdown.value = 5
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        close()
      }
    }, 1000)
  } else {
    clearInterval(timer)
  }
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>