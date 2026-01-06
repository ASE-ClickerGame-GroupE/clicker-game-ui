import type { StoredResult } from '../../storage/resultsStorage.ts'
import { api } from '../index.ts'

export interface ResultsResponse {
  id: string
  finished_at: number
  scores: Record<string, number>
}

const mapBackendResult = (raw: ResultsResponse, userId: string): StoredResult => {
  // Extract the score for the specific user from the scores object
  const userScore = raw.scores[userId] ?? 0

  // Calculate player count from the scores object
  const playerCount = Object.keys(raw.scores).length

  return {
    id: raw.id,
    finishedAt: raw.finished_at,
    score: userScore,
    playerCount,
  }
}

export const fetchResults = async (userId?: string): Promise<StoredResult[]> => {
  if (!userId) {
    return []
  }

  const response = await api.gameApi.get<ResultsResponse[]>(
    `/game?user_id=${userId}`
  )

  return response.data.map((result) => mapBackendResult(result, userId))
}
