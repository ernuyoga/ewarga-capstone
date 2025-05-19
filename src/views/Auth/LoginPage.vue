<template>
  <div class="container">
    <div class="card">
      <h1 class="title">Login - Test VPS 3</h1>

      <div class="form-group">
        <input v-model="email" type="email" placeholder="Email" class="input" @keyup.enter="handleLogin" />
        <input v-model="password" type="password" placeholder="Password" class="input" @keyup.enter="handleLogin" />

        <button @click="handleLogin" class="button">
          Login
        </button>
      </div>

      <div class="mt-6 text-center text-sm text-gray-600">
        Belum punya akun?
        <button @click="goToRegister" class="text-blue-600 hover:underline font-medium ml-1">
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
