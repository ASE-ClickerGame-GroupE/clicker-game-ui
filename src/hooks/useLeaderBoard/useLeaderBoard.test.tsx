import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import type { LeaderboardRowDTO } from '../../api/leaderboard'

jest.mock('js-cookie', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
  },
}))

jest.mock('../../api', () => ({
  api: {
    leaderboard: {
      fetchTotalScoreLeaderboard: jest.fn(),
      fetchBestSingleRunLeaderboard: jest.fn(),
      fetchTotalScoreMe: jest.fn(),
      fetchBestSingleRunMe: jest.fn(),
    },
  },
}))

import { useLeaderBoard } from './useLeaderBoard'

const mockedCookiesGet = Cookies.get as unknown as jest.Mock

const getMockedLeaderboard = () => {

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { api } = require('../../api')
  return api.leaderboard as {
    fetchTotalScoreLeaderboard: jest.Mock
    fetchBestSingleRunLeaderboard: jest.Mock
    fetchTotalScoreMe: jest.Mock
    fetchBestSingleRunMe: jest.Mock
  }
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const makeDTO = (overrides: Partial<LeaderboardRowDTO> = {}): LeaderboardRowDTO => ({
  id: overrides.id ?? 'id-1',
  userName: overrides.userName ?? 'User',
  totalGames: overrides.totalGames ?? 0,
  totalScores: overrides.totalScores ?? 0,
  bestScore: overrides.bestScore ?? 0,
  place: overrides.place ?? 1,
})

describe('useLeaderBoard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('logged out: fetches only TOP total-score list; does not call /me', async () => {
    const lb = getMockedLeaderboard()

    mockedCookiesGet.mockReturnValue(undefined)
    lb.fetchTotalScoreLeaderboard.mockResolvedValue([
      makeDTO({ id: 'ts-1', place: 1, userName: 'Denys', totalGames: 25, totalScores: 500, bestScore: 12 }),
      makeDTO({ id: 'ts-2', place: 2, userName: 'Alice', totalGames: 18, totalScores: 420, bestScore: 10 }),
    ])

    const { result } = renderHook(() => useLeaderBoard('total'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(lb.fetchTotalScoreLeaderboard).toHaveBeenCalledTimes(1)
    expect(lb.fetchTotalScoreLeaderboard).toHaveBeenCalledWith()
    expect(lb.fetchTotalScoreMe).not.toHaveBeenCalled()

    expect(result.current.isError).toBe(false)
    expect(result.current.rows).toHaveLength(2)
    expect(result.current.rows[0]).toMatchObject({
      id: 'ts-1',
      place: 1,
      userName: 'Denys',
      totalGames: 25,
      score: 500,
    })
  })

  test('logged in: prepends ME row for total mode and dedupes if present in top list', async () => {
    const lb = getMockedLeaderboard()

    mockedCookiesGet.mockReturnValue('token-123')

    lb.fetchTotalScoreLeaderboard.mockResolvedValue([
      makeDTO({ id: 'ts-1', place: 1, userName: 'Denys', totalGames: 25, totalScores: 500, bestScore: 12 }),
      makeDTO({ id: 'me-id', place: 500, userName: 'You', totalGames: 10, totalScores: 100, bestScore: 5 }),
    ])

    lb.fetchTotalScoreMe.mockResolvedValue(
      makeDTO({ id: 'me-id', place: 500, userName: 'You', totalGames: 10, totalScores: 100, bestScore: 5 })
    )

    const { result } = renderHook(() => useLeaderBoard('total'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(lb.fetchTotalScoreLeaderboard).toHaveBeenCalledWith()
    expect(lb.fetchTotalScoreMe).toHaveBeenCalledTimes(1)

    expect(result.current.rows[0]).toMatchObject({
      id: 'me-id',
      place: 500,
      userName: 'You',
      totalGames: 10,
      score: 100,
      isMe: true,
    })

    expect(result.current.rows.filter((r) => r.id === 'me-id')).toHaveLength(1)
  })

  test('logged in: best mode uses bestScore for score field', async () => {
    const lb = getMockedLeaderboard()

    mockedCookiesGet.mockReturnValue('token-123')

    lb.fetchBestSingleRunLeaderboard.mockResolvedValue([
      makeDTO({ id: 'bs-1', place: 1, userName: 'Denys', totalGames: 25, totalScores: 500, bestScore: 12 }),
    ])

    lb.fetchBestSingleRunMe.mockResolvedValue(
      makeDTO({ id: 'me-id', place: 500, userName: 'You', totalGames: 10, totalScores: 100, bestScore: 7 })
    )

    const { result } = renderHook(() => useLeaderBoard('best'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(lb.fetchBestSingleRunLeaderboard).toHaveBeenCalledWith()
    expect(lb.fetchBestSingleRunMe).toHaveBeenCalledTimes(1)

    expect(result.current.rows[0]).toMatchObject({
      id: 'me-id',
      score: 7,
      isMe: true,
    })

    expect(result.current.rows[1]).toMatchObject({
      id: 'bs-1',
      score: 12,
    })
  })

  test('logged in: if /me fails, returns only top list (no me row)', async () => {
    const lb = getMockedLeaderboard()

    mockedCookiesGet.mockReturnValue('token-123')

    lb.fetchBestSingleRunLeaderboard.mockResolvedValue([
      makeDTO({ id: 'bs-1', place: 1, userName: 'Denys', totalGames: 25, totalScores: 500, bestScore: 12 }),
    ])

    lb.fetchBestSingleRunMe.mockRejectedValue(new Error('401'))

    const { result } = renderHook(() => useLeaderBoard('best'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0]).toMatchObject({ id: 'bs-1' })
    expect(result.current.rows[0].isMe).toBeUndefined()
  })
})
