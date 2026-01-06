import { api } from '../index'
import type { LeaderboardRowDTO } from './types'

export const fetchBestSingleRunLeaderboard = async (): Promise<LeaderboardRowDTO[]> => {
  const res = await api.leaderboardApi.get<LeaderboardRowDTO[]>('/leaderboard/best-single-run')
  return res.data
}
