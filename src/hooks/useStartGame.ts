import { useMutation } from '@tanstack/react-query'
import {
  startGame,
  type IStartGameBody,
  type IStartGameResponse,
} from '../api/start-game.ts'

export const useStartGame = () => {
  const {
    mutate,
    data,
    isPending: loading,
    error,
  } = useMutation<IStartGameResponse, Error, IStartGameBody>({
    mutationKey: ['start-game'],
    mutationFn: async (body: IStartGameBody) => await startGame(body),
  })

  return { mutate, data, isPending: loading, error }
}
