import axios from 'axios'
import Cookies from 'js-cookie'

export const api = {
  gameApi: axios.create({
    baseURL: 'https://clicker-game-game-service-stage.onrender.com',
  }),
}

// Add Authorization header interceptor to game API
api.gameApi.interceptors.request.use((config) => {
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
