import { describe, expect, test, jest } from '@jest/globals'
import axios from 'axios'
import { addResult } from './add-results.ts'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('addResult', () => {
  test('posts score to /api/results', async () => {
    mockedAxios.post.mockResolvedValue({})

    await addResult(7)

    expect(mockedAxios.post).toHaveBeenCalledWith('/api/results', { score: 7 })
  })
})
