import { useMutation } from '@tanstack/react-query'
import {
  startGame,
  type IStartGameBody,
  type IStartGameResponse,
} from '../../api/start-game/start-game.ts'

export const useStartGame = () => {
  const {
    mutate,
    data,
    isPending: loading,
    error,
  } = useMutation<IStartGameResponse, Error, IStartGameBody>({
    mutationKey: ['start-game'],
    mutationFn: startGame,
  })

  return { mutate, data, isPending: loading, error }
}
