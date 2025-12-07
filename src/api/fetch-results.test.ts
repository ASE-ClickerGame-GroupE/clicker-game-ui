import { describe, it, expect } from '@jest/globals'
import { fetchResults } from './fetch-results'
import result from '../assets/results.json'

describe('fetchResults', () => {
  it('returns the data from assets/results.json', async () => {
    const res = await fetchResults()
    expect(res).toBeDefined()
    expect(res).toHaveProperty('data')
    expect(res.data).toEqual(result)
  })
})

