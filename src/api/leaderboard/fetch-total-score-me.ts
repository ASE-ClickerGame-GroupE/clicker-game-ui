import {
  mockDelay,
  mockTotalScoreMe,
  type TotalScoreMeResponse,
} from './mock'

export const fetchTotalScoreMe = async (): Promise<TotalScoreMeResponse> => {
  await mockDelay(250)
  return mockTotalScoreMe
}
