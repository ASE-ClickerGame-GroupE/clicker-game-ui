import type { AxiosResponse } from 'axios'
import { api } from '../index'
import { fetchBestSingleRunLeaderboard } from './fetch-best-single-run'
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

describe('fetchBestSingleRunLeaderboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls GET /leaderboard/best-single-run and returns rows', async () => {
    const rows: LeaderboardRowDTO[] = [
      {
        id: 'bsr-1',
        userName: 'Alice',
        totalGames: 18,
        totalScores: 420,
        bestScore: 40,
        place: 1,
      },
    ]

    mockedGet.mockResolvedValueOnce({ data: rows } as AxiosResponse)

    const res = await fetchBestSingleRunLeaderboard()

    expect(mockedGet).toHaveBeenCalledTimes(1)
    expect(mockedGet).toHaveBeenCalledWith('/leaderboard/best-single-run')
    expect(res).toEqual(rows)
  })
})
