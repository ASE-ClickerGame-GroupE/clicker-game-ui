import type { AxiosResponse } from 'axios'
import { api } from '../index'
import { fetchTotalScoreLeaderboard } from './fetch-total-score'
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

describe('fetchTotalScoreLeaderboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls GET /leaderboard/total-score and returns rows', async () => {
    const rows: LeaderboardRowDTO[] = [
      {
        id: 'ts-1',
        userName: 'Denys',
        totalGames: 25,
        totalScores: 500,
        bestScore: 12,
        place: 1,
      },
    ]

    mockedGet.mockResolvedValueOnce({ data: rows } as AxiosResponse)

    const res = await fetchTotalScoreLeaderboard()

    expect(mockedGet).toHaveBeenCalledTimes(1)
    expect(mockedGet).toHaveBeenCalledWith('/leaderboard/total-score')
    expect(res).toEqual(rows)
  })
})
