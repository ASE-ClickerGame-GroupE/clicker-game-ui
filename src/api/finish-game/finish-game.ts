import { api } from '../index.ts'

export interface IFinishGameBody {
  session_id: string
  //timestamp
  finished_at: number
  scores: number
}

export const finishGame = async (body: IFinishGameBody) => {
  return api.gameApi.post('/game/finish', body)
}
