import axios from 'axios'
import Cookies from 'js-cookie'

export type LoginResponse = { token: string }
export type RegisterResponse = { ok: true }

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token from cookie to Authorization header for all requests
api.interceptors.request.use((config) => {
  try {
    const token = Cookies.get('token')
    if (token && config.headers) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore allow setting Authorization
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    void e
  }
  return config
})

async function handleResponse<T>(promise: Promise<import('axios').AxiosResponse<T>>): Promise<T> {
  const res = await promise
  return res.data
}

export async function loginRequest(email: string, password: string) {
  return handleResponse<LoginResponse>(api.post('/login', { email, password }))
}

export async function registerRequest(email: string, password: string) {
  return handleResponse<RegisterResponse>(api.post('/register', { email, password }))
}
