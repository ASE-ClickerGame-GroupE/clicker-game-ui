import axios from 'axios'
import Cookies from 'js-cookie'
import { fetchTotalScoreLeaderboard } from './leaderboard/fetch-total-score'
import { fetchBestSingleRunLeaderboard } from './leaderboard/fetch-best-single-run'
import { fetchTotalScoreMe } from './leaderboard/fetch-total-score-me'
import { fetchBestSingleRunMe } from './leaderboard/fetch-best-single-run-me'

export const api = {
  gameApi: axios.create({
    baseURL: 'https://clicker-game-game-service-stage.onrender.com',
  }),
  leaderboard: {
    fetchTotalScoreLeaderboard,
    fetchBestSingleRunLeaderboard,
    fetchTotalScoreMe,
    fetchBestSingleRunMe,
  },
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
