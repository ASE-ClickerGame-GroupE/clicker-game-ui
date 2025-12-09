import type { StoredResult } from '../../storage/resultsStorage.ts'
import { api } from '../index.ts'

export interface BackendResult {
  id: string
  finishedAt: number
  scores: number
}

export interface ResultsResponse {
  id: string
  finished_at: number
  scores: number
}

const mapBackendResult = (raw: ResultsResponse): StoredResult => ({
  id: raw.id,
  finishedAt: raw.finished_at,
  score: raw.scores,
})

export const fetchResults = async (userId: string): Promise<StoredResult[]> => {
  const response = await api.gameApi.get<ResultsResponse[]>(
    `/game?user_id=${userId}`
  )

  return response.data.map(mapBackendResult)
}
