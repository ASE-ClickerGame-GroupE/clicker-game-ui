import { describe, expect, test, jest } from '@jest/globals'
import { fetchResults } from './fetch-results.ts'
import { api } from '../index'

describe('fetchResults', () => {
  test('calls /game?user_id= and maps backend response to StoredResult', async () => {
    const userId = 'test-user-id'
    const backendData = [
      { id: '1', finished_at: 1000, scores: { [userId]: 10 } },
      { id: '2', finished_at: 2000, scores: { [userId]: 5 } },
    ]

    // create an any-typed mock to avoid TypeScript typing issues
    const mockGet = jest.fn()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockGet.mockResolvedValue({ data: backendData } as unknown as never)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    api.gameApi = { get: mockGet }

    const results = await fetchResults(userId)

    expect(mockGet).toHaveBeenCalledWith(`/game?user_id=${userId}`)
    expect(results).toEqual([
      { id: '1', finishedAt: 1000, score: 10, playerCount: 1 },
      { id: '2', finishedAt: 2000, score: 5, playerCount: 1 },
    ])
  })

  test('returns empty array when userId is not provided', async () => {
    const results = await fetchResults()
    expect(results).toEqual([])
  })

  test('extracts correct user score from multiplayer game', async () => {
    const userId = 'user-1'
    const backendData = [
      {
        id: '1',
        finished_at: 1000,
        scores: {
          'user-1': 10,
          'user-2': 15,
          'user-3': 8,
        },
      },
    ]

    const mockGet = jest.fn()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockGet.mockResolvedValue({ data: backendData } as unknown as never)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    api.gameApi = { get: mockGet }

    const results = await fetchResults(userId)

    expect(results).toEqual([
      { id: '1', finishedAt: 1000, score: 10, playerCount: 3 },
    ])
  })

  test('returns 0 score when user is not in scores object', async () => {
    const userId = 'user-not-in-game'
    const backendData = [
      {
        id: '1',
        finished_at: 1000,
        scores: {
          'user-1': 10,
          'user-2': 15,
        },
      },
    ]

    const mockGet = jest.fn()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockGet.mockResolvedValue({ data: backendData } as unknown as never)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    api.gameApi = { get: mockGet }

    const results = await fetchResults(userId)

    expect(results).toEqual([
      { id: '1', finishedAt: 1000, score: 0, playerCount: 2 },
    ])
  })
})
