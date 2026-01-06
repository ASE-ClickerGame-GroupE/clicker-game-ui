import { api } from '../index'
import type { LeaderboardRowDTO } from './types'

export const fetchTotalScoreLeaderboard = async (): Promise<LeaderboardRowDTO[]> => {
  const res = await api.leaderboardApi.get<LeaderboardRowDTO[]>('/leaderboard/total-score')
  return res.data
}

