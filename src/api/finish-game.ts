import axios from 'axios'

export interface IFinishGameBody {
  session_id: string
  //timestamp
  finished_at: number
  scores: number
}

export const finishGame = async (body: IFinishGameBody) => {
  return axios.post('/game/finish', body)
}
