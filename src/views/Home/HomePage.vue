<template>
    <div class="container">
        <div class="card">
            <h1 class="title">Home</h1>
            <p class="mb-6">Welcome, {{ auth.user?.name || 'Guest' }}!</p>
            <button @click="handleLogout" class="button">Logout</button>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
    auth.logout()
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

.button {
  @apply w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200;
}
</style>
