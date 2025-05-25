<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f6f6f6] relative overflow-hidden">
    <!-- Background Image -->
    <img src="@/assets/kota.svg" alt="Kota Background"
      class="absolute inset-0 w-full h-full object-cover object-bottom z-0 pointer-events-none select-none"
      draggable="false" />
    <!-- Card -->
    <div
      class="shadow-lg rounded-3xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 p-6 md:p-8 w-full max-w-md flex flex-col items-center z-10 backdrop-blur-[2px]">
      <!-- Logo atas -->
      <img src="@/assets/eWarga_logo.svg" alt="eWarga Logo" class="w-24 h-24 mb-8" />

      <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-white mb-1">Email</label>
          <input v-model="email" type="email" placeholder="Masukkan email"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50"
            autocomplete="username" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-1">Password</label>
          <input v-model="password" type="password" placeholder="Masukkan password"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50"
            autocomplete="current-password" required />
        </div>
        <button type="submit"
          class="w-full bg-[#03BF8C] hover:bg-[#029e73] text-white py-2 rounded-lg font-semibold transition duration-200">
          Masuk
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-white">
        Belum punya akun?
        <button @click="goToRegister" class="text-[#03BF8C] hover:underline font-medium ml-1">
          Daftar sekarang
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push('/')
  } catch (err) {
    const res = err.response?.data
    let message = 'Login gagal'

    if (res?.kode === 422 && res?.data) {
      const errorMessages = Object.values(res.data).flat()
      message = errorMessages.join('\n')
    } else if (res?.message) {
      message = res.message
    }
    alert(message)
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>