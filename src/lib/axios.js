import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.ewarga.rionaru.site/api',
  headers: {
    'Content-Type': 'application/json',
    // tambahkan header lain jika dibutuhkan
  }
})

// Optional: Tambah interceptor untuk Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // atau dari Pinia
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default api
