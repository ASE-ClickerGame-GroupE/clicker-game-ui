import { useMutation } from '@tanstack/react-query'
import { finishGame, type IFinishGameBody } from '../../api/finish-game/finish-game.ts'

export const useFinishGame = () => {
  const {
    mutate,
    isPending: loading,
    error,
  } = useMutation({
    mutationKey: ['finish-game'],
    mutationFn: async (body: IFinishGameBody) => await finishGame(body),
  })

  return { mutate, isPending: loading, error }
}
