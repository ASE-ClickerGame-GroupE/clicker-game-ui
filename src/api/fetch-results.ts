import axios from 'axios'
import type { StoredResult } from '../storage/resultsStorage'

export interface BackendResult {
  id: string
  finishedAt: number
  scores: number
}

const mapBackendResult = (raw: BackendResult): StoredResult => ({
  id: raw.id,
  finishedAt: raw.finishedAt,
  score: raw.scores,
})

export const fetchResults = async (): Promise<StoredResult[]> => {
  const response = await axios.get<BackendResult[]>('/api/results')

  return response.data.map(mapBackendResult)
}
