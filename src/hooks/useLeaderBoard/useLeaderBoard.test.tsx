import React from 'react'
import { describe, expect, test, jest, beforeEach } from '@jest/globals'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'

import { useLeaderBoard } from './useLeaderBoard'
import { api } from '../../api'

jest.mock('js-cookie', () => ({
  get: jest.fn(),
}))
import Cookies from 'js-cookie'

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

type TotalScoreLeaderboardResponse = {
  data: Array<{
    id: string
    place: number
    userName: string
    totalGames: number
    totalScores: number
  }>
}

type BestSingleRunLeaderboardResponse = {
  data: Array<{
    id: string
    place: number
    userName: string
    totalGames: number
    bestScore: number
  }>
}

type TotalScoreMeResponse = {
  me: {
    id: string
    place: number
    userName: string
    totalGames: number
    totalScores: number
  } | null
}

type BestSingleRunMeResponse = {
  me: {
    id: string
    place: number
    userName: string
    totalGames: number
    bestScore: number
  } | null
}

// ✅ jest.Mock yerine MockedFunction kullandık (setup farklarından etkilenmez)
const mockedApi = api as unknown as {
  leaderboard: {
    fetchTotalScoreLeaderboard: jest.MockedFunction<
      () => Promise<TotalScoreLeaderboardResponse>
    >
    fetchBestSingleRunLeaderboard: jest.MockedFunction<
      () => Promise<BestSingleRunLeaderboardResponse>
    >
    fetchTotalScoreMe: jest.MockedFunction<() => Promise<TotalScoreMeResponse>>
    fetchBestSingleRunMe: jest.MockedFunction<
      () => Promise<BestSingleRunMeResponse>
    >
  }
}

const createWrapper = () => {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false, staleTime: 0 },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  )
}

describe('useLeaderBoard', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('logged out: returns only top rows (no meQuery call, no You row)', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(undefined)

    mockedApi.leaderboard.fetchTotalScoreLeaderboard.mockResolvedValue({
      data: [
        {
          id: 'ts-1',
          place: 1,
          userName: 'Max',
          totalGames: 25,
          totalScores: 500,
        },
      ],
    })

    const { result } = renderHook(() => useLeaderBoard('total'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isError).toBe(false)
    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0]).toMatchObject({
      id: 'ts-1',
      place: 1,
      userName: 'Max',
      totalGames: 25,
      score: 500,
    })
    expect(result.current.rows[0].isMe).toBeUndefined()

    expect(mockedApi.leaderboard.fetchTotalScoreMe).not.toHaveBeenCalled()
  })

  test('logged in: prepends me row from /me endpoint', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('token-123')

    mockedApi.leaderboard.fetchTotalScoreLeaderboard.mockResolvedValue({
      data: [
        {
          id: 'ts-1',
          place: 1,
          userName: 'Max',
          totalGames: 25,
          totalScores: 500,
        },
        {
          id: 'ts-2',
          place: 2,
          userName: 'Alice',
          totalGames: 18,
          totalScores: 420,
        },
      ],
    })

    mockedApi.leaderboard.fetchTotalScoreMe.mockResolvedValue({
      me: {
        id: 'ts-me',
        place: 500,
        userName: 'You',
        totalGames: 18,
        totalScores: 123,
      },
    })

    const { result } = renderHook(() => useLeaderBoard('total'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isError).toBe(false)
    expect(result.current.rows).toHaveLength(3)

    expect(result.current.rows[0]).toMatchObject({
      id: 'ts-me',
      place: 500,
      userName: 'You',
      totalGames: 18,
      score: 123,
      isMe: true,
    })

    expect(result.current.rows[1].id).toBe('ts-1')
    expect(result.current.rows[2].id).toBe('ts-2')

    expect(mockedApi.leaderboard.fetchTotalScoreMe).toHaveBeenCalledTimes(1)
  })

  test('logged in: if me endpoint throws, hook falls back to top only', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue('token-123')

    mockedApi.leaderboard.fetchTotalScoreLeaderboard.mockResolvedValue({
      data: [
        {
          id: 'ts-1',
          place: 1,
          userName: 'Max',
          totalGames: 25,
          totalScores: 500,
        },
      ],
    })

    mockedApi.leaderboard.fetchTotalScoreMe.mockRejectedValue(new Error('401'))

    const { result } = renderHook(() => useLeaderBoard('total'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isError).toBe(false)
    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0].userName).toBe('Max')
  })

  test('best mode: maps bestScore to score and uses best endpoints', async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(undefined)

    mockedApi.leaderboard.fetchBestSingleRunLeaderboard.mockResolvedValue({
      data: [
        {
          id: 'bsr-1',
          place: 1,
          userName: 'Max',
          totalGames: 25,
          bestScore: 12,
        },
      ],
    })

    const { result } = renderHook(() => useLeaderBoard('best'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.isError).toBe(false)
    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0]).toMatchObject({
      id: 'bsr-1',
      place: 1,
      userName: 'Max',
      totalGames: 25,
      score: 12,
    })

    expect(
      mockedApi.leaderboard.fetchBestSingleRunLeaderboard
    ).toHaveBeenCalledTimes(1)
    expect(mockedApi.leaderboard.fetchBestSingleRunMe).not.toHaveBeenCalled()
  })
})
