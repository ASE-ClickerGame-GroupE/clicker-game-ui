import { mockDelay, mockBestSingleRun, type BestSingleRunResponse } from './mock'

export const fetchBestSingleRunLeaderboard =
  async (): Promise<BestSingleRunResponse> => {
    await mockDelay(250)
    return mockBestSingleRun
  }
