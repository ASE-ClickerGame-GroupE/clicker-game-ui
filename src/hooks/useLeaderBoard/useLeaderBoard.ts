import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { api } from '../../api'
import type {
  TotalScoreResponse,
  BestSingleRunResponse,
  TotalScoreMeResponse,
  BestSingleRunMeResponse,
} from '../../api/leaderboard/mock'

export type LeaderboardMode = 'total' | 'best'

export type LeaderboardRowUI = {
  id: string
  place: number
  userName: string
  totalGames: number
  score: number
  isMe?: boolean
}

const mapTopRows = (
  mode: LeaderboardMode,
  res: TotalScoreResponse | BestSingleRunResponse
): LeaderboardRowUI[] => {
  if (mode === 'total') {
    const r = res as TotalScoreResponse
    return r.data.map((x) => ({
      id: x.id,
      place: x.place,
      userName: x.userName,
      totalGames: x.totalGames,
      score: x.totalScores,
    }))
  }

  const r = res as BestSingleRunResponse
  return r.data.map((x) => ({
    id: x.id,
    place: x.place,
    userName: x.userName,
    totalGames: x.totalGames,
    score: x.bestScore,
  }))
}

const mapMeRow = (
  mode: LeaderboardMode,
  res: TotalScoreMeResponse | BestSingleRunMeResponse
): LeaderboardRowUI | null => {
  if (mode === 'total') {
    const r = res as TotalScoreMeResponse
    if (!r.me) return null
    return {
      id: r.me.id,
      place: r.me.place,
      userName: r.me.userName,
      totalGames: r.me.totalGames,
      score: r.me.totalScores,
      isMe: true,
    }
  }

  const r = res as BestSingleRunMeResponse
  if (!r.me) return null
  return {
    id: r.me.id,
    place: r.me.place,
    userName: r.me.userName,
    totalGames: r.me.totalGames,
    score: r.me.bestScore,
    isMe: true,
  }
}

export const useLeaderBoard = (mode: LeaderboardMode) => {
  const token = Cookies.get('token')
  const isLoggedIn = Boolean(token)
  const authKey = isLoggedIn ? 'auth' : 'anon'

  // 1) Top list: always
  const topQuery = useQuery({
    queryKey: ['leaderboard', mode, 'top', authKey],
    queryFn: async () => {
      if (mode === 'total') {
        return await api.leaderboard.fetchTotalScoreLeaderboard()
      }
      return await api.leaderboard.fetchBestSingleRunLeaderboard()
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

  // 2) Me row: only if logged in
  const meQuery = useQuery({
    queryKey: ['leaderboard', mode, 'me', authKey],
    enabled: isLoggedIn,
    retry: false,
    queryFn: async () => {
      try {
        if (mode === 'total') {
          return await api.leaderboard.fetchTotalScoreMe()
        }
        return await api.leaderboard.fetchBestSingleRunMe()
      } catch {
        return { me: null }
      }
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

  const rows = useMemo<LeaderboardRowUI[]>(() => {
    if (!topQuery.data) return []

    const topRows = mapTopRows(mode, topQuery.data)
    const meRow = meQuery.data ? mapMeRow(mode, meQuery.data) : null

    if (!meRow) return topRows

    const topWithoutMe = topRows.filter((r) => r.id !== meRow.id)
    return [meRow, ...topWithoutMe]
  }, [mode, topQuery.data, meQuery.data])

  return {
    rows,
    isLoading: topQuery.isLoading || (isLoggedIn && meQuery.isLoading),
    isError: topQuery.isError,
  }
}
