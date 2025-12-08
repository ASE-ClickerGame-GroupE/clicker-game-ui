import { describe, expect, test, jest } from '@jest/globals'
import axios from 'axios'
import { fetchResults, type BackendResult } from './fetch-results'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('fetchResults', () => {
  test('calls /api/results and maps backend response to StoredResult', async () => {
    const backendData: BackendResult[] = [
      { id: '1', finishedAt: 1000, scores: 10 },
      { id: '2', finishedAt: 2000, scores: 5 },
    ]

    mockedAxios.get.mockResolvedValue({ data: backendData })

    const results = await fetchResults()

    expect(mockedAxios.get).toHaveBeenCalledWith('/api/results')
    expect(results).toEqual([
      { id: '1', finishedAt: 1000, score: 10 },
      { id: '2', finishedAt: 2000, score: 5 },
    ])
  })
})

