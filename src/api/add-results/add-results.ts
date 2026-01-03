import axios from 'axios'
import Cookies from 'js-cookie'

// Create axios instance with auth interceptor for results API
const resultsApi = axios.create()

resultsApi.interceptors.request.use((config) => {
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

export const addResult = async (score: number): Promise<void> => {
  await resultsApi.post('/api/results', { score })
}
