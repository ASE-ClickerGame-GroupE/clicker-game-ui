import axios from 'axios'

export const api = {
  gameApi: axios.create({
    baseURL: 'https://clicker-game-game-service-stage.onrender.com',
  }),
}
