import type { AxiosResponse } from 'axios'
import { api } from '../index'
import { fetchBestSingleRunMe } from './fetch-best-single-run-me'
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

describe('fetchBestSingleRunMe', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls GET /leaderboard/best-single-run/me and returns DTO', async () => {
    const me: LeaderboardRowDTO = {
      id: 'me-2',
      userName: 'me@test.com',
      totalGames: 3,
      totalScores: 52,
      bestScore: 20,
      place: 2,
    }

    mockedGet.mockResolvedValueOnce({ data: me } as AxiosResponse)

    const res = await fetchBestSingleRunMe()

    expect(mockedGet).toHaveBeenCalledTimes(1)
    expect(mockedGet).toHaveBeenCalledWith('/leaderboard/best-single-run/me')
    expect(res).toEqual(me)
  })
})
