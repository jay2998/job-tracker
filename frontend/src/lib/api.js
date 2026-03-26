import axios from 'axios'

const TOKEN_STORAGE_KEY = 'jobpilot_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    delete api.defaults.headers.common.Authorization
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || ''
}

export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)
export const getCurrentUser = () => api.get('/auth/me')
export const getApplications = (params) => api.get('/applications', { params })
export const getStats = () => api.get('/applications/stats')
export const createApplication = (data) => api.post('/applications', data)
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data)
export const deleteApplication = (id) => api.delete(`/applications/${id}`)

export function getApiError(error, fallback = 'Something went wrong') {
  return error?.response?.data?.error || error?.message || fallback
}

setAuthToken(getStoredToken())

export default api
