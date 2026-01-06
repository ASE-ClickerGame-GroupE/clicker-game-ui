import type { AxiosResponse } from 'axios'
import { api } from '../index'
import { fetchTotalScoreMe } from './fetch-total-score-me'
import type { LeaderboardRowDTO } from './types'

jest.mock('../index', () => ({
  api: {
    leaderboardApi: {
      get: jest.fn(),
    },
  },
}))

const mockedGet = api.leaderboardApi.get as unknown as jest.MockedFunction<
  (url: string, config?: unknown) => Promise<AxiosResponse<unknown>>
>

describe('fetchTotalScoreMe', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls GET /leaderboard/total-score/me and returns DTO', async () => {
    const me: LeaderboardRowDTO = {
      id: 'me-1',
      userName: 'me@test.com',
      totalGames: 3,
      totalScores: 52,
      bestScore: 20,
      place: 2,
    }

    mockedGet.mockResolvedValueOnce({ data: me } as AxiosResponse)

    const res = await fetchTotalScoreMe()

    expect(mockedGet).toHaveBeenCalledTimes(1)
    expect(mockedGet).toHaveBeenCalledWith('/leaderboard/total-score/me')
    expect(res).toEqual(me)
  })
})
