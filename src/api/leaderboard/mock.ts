export type TotalScoreItem = {
  id: string
  place: number
  userName: string
  totalGames: number
  totalScores: number
}

export type BestSingleRunItem = {
  id: string
  place: number
  userName: string
  totalGames: number
  bestScore: number
}

export type TotalScoreMeResponse = {
  me: TotalScoreItem | null
}

export type BestSingleRunMeResponse = {
  me: BestSingleRunItem | null
}

export type TotalScoreResponse = { data: TotalScoreItem[] }
export type BestSingleRunResponse = { data: BestSingleRunItem[] }

export const mockDelay = async (ms = 250) =>
  await new Promise<void>((resolve) => setTimeout(resolve, ms))

export const mockTotalScore: TotalScoreResponse = {
  data: [
    { id: 'ts-1', place: 1, userName: 'Max', totalGames: 25, totalScores: 500 },
    { id: 'ts-2', place: 2, userName: 'Alice', totalGames: 18, totalScores: 420 },
    { id: 'ts-3', place: 3, userName: 'Bob', totalGames: 30, totalScores: 410 },
    { id: 'ts-4', place: 4, userName: 'Charlie', totalGames: 12, totalScores: 390 },
    { id: 'ts-5', place: 5, userName: 'Eve', totalGames: 9, totalScores: 360 },
  ],
}

export const mockBestSingleRun: BestSingleRunResponse = {
  data: [
    { id: 'bsr-1', place: 1, userName: 'Max', totalGames: 25, bestScore: 12 },
    { id: 'bsr-2', place: 2, userName: 'Alice', totalGames: 18, bestScore: 11 },
    { id: 'bsr-3', place: 3, userName: 'Bob', totalGames: 30, bestScore: 10 },
    { id: 'bsr-4', place: 4, userName: 'Charlie', totalGames: 12, bestScore: 9 },
    { id: 'bsr-5', place: 5, userName: 'Eve', totalGames: 9, bestScore: 8 },
  ],
}

export const mockTotalScoreMe: TotalScoreMeResponse = {
  me: {
    id: 'ts-me',
    place: 500,
    userName: 'You',
    totalGames: 18,
    totalScores: 123,
  },
}

export const mockBestSingleRunMe: BestSingleRunMeResponse = {
  me: {
    id: 'bsr-me',
    place: 120,
    userName: 'You',
    totalGames: 18,
    bestScore: 11,
  },
}
