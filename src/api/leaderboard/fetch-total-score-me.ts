import { api } from '../index'
import type { LeaderboardRowDTO } from './types'

export const fetchTotalScoreMe = async (): Promise<LeaderboardRowDTO> => {
  const res = await api.leaderboardApi.get<LeaderboardRowDTO>(
    '/leaderboard/total-score/me'
  )
  return res.data
}
