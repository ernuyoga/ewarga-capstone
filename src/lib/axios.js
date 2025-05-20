import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.ewarga.rionaru.site/api',
  headers: {
    'Content-Type': 'application/json',
    // tambahkan header lain jika dibutuhkan
  }
})

const gambar = axios.create({
  baseURL: 'https://api.ewarga.rionaru.site/storage',
  headers: {
    'Content-Type': 'application/json',
  }
})

function getImageUrl(file_path) {
    return file_path
        ? `https://api.ewarga.rionaru.site/storage/${file_path}`
        : 'https://via.placeholder.com/150';
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default api
