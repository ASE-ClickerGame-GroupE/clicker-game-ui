import { api } from '../index.ts'

export interface IStartGameBody {
  user_id: string
}

export interface IStartGameResponse {
  session_id: string
}

export const startGame = async (
  body: IStartGameBody
): Promise<IStartGameResponse> => {
  const { data } = await api.gameApi.post<IStartGameResponse>(
    '/game/start',
    body
  )
  return data
}
