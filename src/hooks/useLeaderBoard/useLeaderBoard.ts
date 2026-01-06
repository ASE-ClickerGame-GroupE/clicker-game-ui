import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { api } from '../../api'
import type { LeaderboardRowDTO } from '../../api/leaderboard/types.ts'

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
  rows: LeaderboardRowDTO[]
): LeaderboardRowUI[] => {
  return rows.map((x) => ({
    id: x.id,
    place: x.place,
    userName: x.userName,
    totalGames: x.totalGames,
    score: mode === 'total' ? x.totalScores : x.bestScore,
  }))
}

const mapMeRow = (
  mode: LeaderboardMode,
  me: LeaderboardRowDTO
): LeaderboardRowUI => ({
  id: me.id,
  place: me.place,
  userName: me.userName,
  totalGames: me.totalGames,
  score: mode === 'total' ? me.totalScores : me.bestScore,
  isMe: true,
})

export const useLeaderBoard = (mode: LeaderboardMode) => {
  const token = Cookies.get('token')
  const isLoggedIn = Boolean(token)
  const authKey = isLoggedIn ? 'auth' : 'anon'

  // 1) Top list: always
  const topQuery = useQuery({
    queryKey: ['leaderboard', mode, 'top', authKey],
    queryFn: async (): Promise<LeaderboardRowDTO[]> => {
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
    queryFn: async (): Promise<LeaderboardRowDTO | null> => {
      try {
        if (mode === 'total') {
          return await api.leaderboard.fetchTotalScoreMe()
        }
        return await api.leaderboard.fetchBestSingleRunMe()
      } catch {
        return null
      }
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })

  const rows = useMemo<LeaderboardRowUI[]>(() => {
    if (!topQuery.data) return []

    const topRows = mapTopRows(mode, topQuery.data)
    const meDTO = meQuery.data ?? null

    if (!meDTO) return topRows

    const meRow = mapMeRow(mode, meDTO)
    const topWithoutMe = topRows.filter((r) => r.id !== meRow.id)

    return [meRow, ...topWithoutMe]
  }, [mode, topQuery.data, meQuery.data])

  return {
    rows,
    isLoading: topQuery.isLoading || (isLoggedIn && meQuery.isLoading),
    isError: topQuery.isError,
  }
}
