import axios from 'axios'
import Cookies from 'js-cookie'

const AUTH_BASE_URL = 'https://clicker-game-user-service-stage.onrender.com'

export type LoginResponse = {
  access_token: string
  token_type: string
}

export type RegisterResponse = {
  user_id: string
  loging: string
  email: string
  created_at: number
}

export type UserResponse = {
  user_id: string
  loging: string
  email: string
  created_at: number
}

export const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

authApi.interceptors.request.use((config) => {
  try {
    const token = Cookies.get('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    void e
  }
  return config
})

export async function loginRequest(username: string, password: string): Promise<LoginResponse> {
  // Login uses form-urlencoded format
  const params = new URLSearchParams()
  params.append('grant_type', 'password')
  params.append('username', username)
  params.append('password', password)
  params.append('scope', '')
  params.append('client_id', '')
  params.append('client_secret', '')

  const response = await axios.post<LoginResponse>(
    `${AUTH_BASE_URL}/auth/token`,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
  return response.data
}

export async function registerRequest(
  login: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const response = await authApi.post<RegisterResponse>('/auth/signup', {
    loging: login,
    email,
    password,
  })
  return response.data
}

export async function getMeRequest(): Promise<UserResponse> {
  const response = await authApi.get<UserResponse>('/auth/me')
  return response.data
}
