import axios from 'axios'

export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')
export const api = axios.create({ baseURL: API_BASE })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jaba_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getErrorMessage = (error) => error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.'
export const getImageUrl = (url) => {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const backend = API_BASE.replace(/\/api$/, '')
  return `${backend}/${String(url).replace(/^\//, '')}`
}
