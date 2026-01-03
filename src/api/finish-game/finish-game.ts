import { api } from '../index.ts'

export interface IFinishGameBody {
  session_id: string
  finished_at: number
  scores: Record<string, number> // { 'user_id': score, 'other_user_id': score }
}

export const finishGame = async (body: IFinishGameBody) => {
  return api.gameApi.post('/game/finish', body)
}
