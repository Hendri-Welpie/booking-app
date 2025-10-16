import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:9080',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(cfg => {
  // Skip adding Authorization for login and register endpoints
  const skipAuth = cfg.url?.includes('/auth/login') || cfg.url?.includes('/auth/register') || cfg.url?.includes('/reservations/available-rooms')

  if (!skipAuth) {
    const token = localStorage.getItem('token')
    if (token) {
      cfg.headers = cfg.headers || {}
      cfg.headers.Authorization = `Bearer ${token}`
    }
  }

  return cfg
})

export default api