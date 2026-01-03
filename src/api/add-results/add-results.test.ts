const mockResultsApiPost: any = jest.fn()

jest.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    post: mockResultsApiPost,
    get: jest.fn(),
  }

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
      post: jest.fn(),
    },
    create: jest.fn(() => mockAxiosInstance),
  }
})

import { describe, expect, test, jest } from '@jest/globals'
import { addResult } from './add-results.ts'

describe('addResult', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('posts score to /api/results', async () => {
    mockResultsApiPost.mockResolvedValue({} as any)

    await addResult(7)

    expect(mockResultsApiPost).toHaveBeenCalledWith('/api/results', { score: 7 })
  })
})
