<template>
  <div class="container">
    <div class="card">
      <h1 class="title">Register</h1>
      <div class="form-group">
        <input v-model="name" type="text" placeholder="Nama Lengkap" class="input" @keyup.enter="handleRegister" />
        <input v-model="email" type="email" placeholder="Email" class="input" @keyup.enter="handleRegister" />
        <input v-model="password" type="password" placeholder="Password" class="input" @keyup.enter="handleRegister" />
        <input v-model="passwordConfirmation" type="password" placeholder="Konfirmasi Password" class="input"
          @keyup.enter="handleRegister" />
        <button @click="handleRegister" class="button">Lanjutkan</button>
      </div>
      <div class="mt-6 text-center text-sm text-gray-600">
        Sudah punya akun?
        <button @click="goToLogin" class="text-blue-600 hover:underline font-medium ml-1">
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

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const auth = useAuthStore()

const handleRegister = async () => {
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
    alert(message)
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.container {
  @apply min-h-screen flex items-center justify-center bg-gray-100;
}

.card {
  @apply bg-white shadow-lg rounded-xl p-8 w-full max-w-md;
}

.title {
  @apply text-2xl font-semibold text-center text-gray-700 mb-6;
}

.form-group {
  @apply space-y-4;
}

.input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400;
}

.button {
  @apply w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200;
}
</style>