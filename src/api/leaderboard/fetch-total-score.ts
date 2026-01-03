import { mockDelay, mockTotalScore, type TotalScoreResponse } from './mock'

export const fetchTotalScoreLeaderboard = async (): Promise<TotalScoreResponse> => {
  await mockDelay(250)
  return mockTotalScore
}
