import axios from 'axios'
import Cookies from 'js-cookie'
import * as leaderboard from './leaderboard'

export const api = {
  gameApi: axios.create({
    baseURL: 'https://clicker-game-game-service-stage.onrender.com',
  }),
  leaderboardApi: axios.create({
    baseURL: 'https://clicker-game-leaderboard-service-stage.onrender.com',
  }),
  leaderboard,
}

const attachAuth = (client: typeof api.gameApi) => {
  client.interceptors.request.use((config) => {
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
}

attachAuth(api.gameApi)
attachAuth(api.leaderboardApi)
