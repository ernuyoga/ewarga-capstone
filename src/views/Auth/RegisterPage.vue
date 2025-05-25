<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f6f6f6] relative overflow-hidden">
    <!-- PopupMessage -->
    <PopupMessage :show="showPopup" type="warning" title="Registrasi gagal" :text="popupText"
      @close="showPopup = false" />

    <!-- Background Image -->
    <img src="@/assets/kota.svg" alt="Kota Background"
      class="absolute inset-0 w-full h-full object-cover object-bottom z-0 pointer-events-none select-none"
      draggable="false" />
    <!-- Card -->
    <div
      class="shadow-lg rounded-xl mx-4 md:mx-8 lg:mx-16 xl:mx-24 p-6 md:p-8 w-full max-w-md flex flex-col items-center z-10 backdrop-blur-[2px]">
      <!-- Logo atas -->
      <img src="@/assets/eWarga_logo.svg" alt="eWarga Logo" class="w-24 h-24 mb-8" />

      <form @submit.prevent="handleRegister" class="w-full flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-white mb-1">Nama Lengkap</label>
          <input v-model="name" type="text" placeholder="Masukkan nama lengkap"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50"
            required />
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-1">Email</label>
          <input v-model="email" type="email" placeholder="Masukkan email"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50"
            required />
          <span v-if="email && !email.includes('@')" class="text-xs text-red-500 mt-1 block">
            Email harus mengandung tanda @
          </span>
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-1">Password</label>
          <input v-model="password" type="password" placeholder="Masukkan password"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50"
            required />
          <span v-if="password && password.length < 8" class="text-xs text-red-500 mt-1 block">
            Password minimal 8 karakter
          </span>
        </div>
        <div>
          <label class="block text-sm font-medium text-white mb-1">Konfirmasi Password</label>
          <input v-model="passwordConfirmation" type="password" placeholder="Masukkan ulang password"
            class="w-full border border-gray-200 rounded-lg px-3 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-[#03BF8C] bg-gray-50"
            required />
          <span v-if="passwordConfirmation && passwordConfirmation !== password"
            class="text-xs text-red-500 mt-1 block">
            Konfirmasi password tidak sama
          </span>
        </div>
        <button type="submit"
          class="w-full bg-[#03BF8C] hover:bg-[#029e73] text-white py-2 rounded-lg font-semibold transition duration-200"
          :disabled="!email.includes('@') || password.length < 8 || passwordConfirmation !== password">
          Daftar
        </button>
      </form>
      <div class="mt-6 text-center text-sm text-white">
        Sudah punya akun?
        <button @click="goToLogin" class="text-[#03BF8C] hover:underline font-medium ml-1">
          Login sekarang
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register as registerApi } from "@/services/authService";
import { useAuthStore } from '@/store/auth'
import PopupMessage from '@/components/shared/PopupMessage.vue'

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const auth = useAuthStore()

const showPopup = ref(false)
const popupText = ref('')

const handleRegister = async () => {
  if (!email.value.includes('@')) {
    popupText.value = 'Email harus mengandung tanda @'
    showPopup.value = true
    return
  }
  if (password.value.length < 8) {
    popupText.value = 'Password minimal 8 karakter'
    showPopup.value = true
    return
  }
  if (password.value !== passwordConfirmation.value) {
    popupText.value = 'Konfirmasi password tidak sama'
    showPopup.value = true
    return
  }
  try {
    await registerApi({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })

    await auth.login({
      email: email.value,
      password: password.value,
    })

    router.push({
      path: '/complete-registration',
      query: { nama: name.value }
    })
  } catch (err) {
    const res = err.response?.data
    let message = 'Registrasi gagal'

    if (res?.kode === 422 && res?.data) {
      const errorMessages = Object.values(res.data).flat()
      message = errorMessages.join('\n')
    } else if (res?.message) {
      message = res.message
    }
    popupText.value = message
    showPopup.value = true
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>