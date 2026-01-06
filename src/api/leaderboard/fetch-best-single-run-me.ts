import { api } from '../index'
import type { LeaderboardRowDTO } from './types'

export const fetchBestSingleRunMe = async (): Promise<LeaderboardRowDTO> => {
  const res = await api.leaderboardApi.get<LeaderboardRowDTO>(
    '/leaderboard/best-single-run/me'
  )
  return res.data
}
