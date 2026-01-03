import {
  mockDelay,
  mockBestSingleRunMe,
  type BestSingleRunMeResponse,
} from './mock'

export const fetchBestSingleRunMe =
  async (): Promise<BestSingleRunMeResponse> => {
    await mockDelay(250)
    return mockBestSingleRunMe
  }
