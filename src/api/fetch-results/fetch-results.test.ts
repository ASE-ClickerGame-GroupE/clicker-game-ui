import { describe, expect, test, jest } from '@jest/globals'
import { fetchResults } from './fetch-results.ts'
import { api } from '../index'

describe('fetchResults', () => {
  test('calls /game?user_id= and maps backend response to StoredResult', async () => {
    const backendData = [
      { id: '1', finished_at: 1000, scores: 10 },
      { id: '2', finished_at: 2000, scores: 5 },
    ]

    // create an any-typed mock to avoid TypeScript typing issues
    const mockGet = jest.fn()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockGet.mockResolvedValue({ data: backendData } as unknown as never)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    api.gameApi = { get: mockGet }

    const results = await fetchResults()

    expect(mockGet).toHaveBeenCalledWith('/game?user_id=')
    expect(results).toEqual([
      { id: '1', finishedAt: 1000, score: 10 },
      { id: '2', finishedAt: 2000, score: 5 },
    ])
  })
})
