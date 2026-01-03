import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, jest } from '@jest/globals'
import { QueryProviderWrapper } from '../../test-helpers/wrappers.tsx'
import { useFetchResults } from './useFetchResults.ts'
import { fetchResults } from '../../api/fetch-results/fetch-results.ts'
import type { StoredResult } from '../../storage/resultsStorage.ts'

jest.mock('../../api/fetch-results/fetch-results.ts')

const mockedFetchResults = fetchResults as jest.MockedFunction<typeof fetchResults>

function TestComponent() {
  const { data, isFetching, error } = useFetchResults(null, 'local-user-123')
  if (isFetching) {
    return <div>LOADING</div>
  }
  if (error) {
    return <div>ERROR</div>
  }
  return <div>DATA: {JSON.stringify(data)}</div>
}

describe('useFetchResults', () => {
  it('fetches and merges results from both authenticated and local storage', async () => {
    const mockData: StoredResult[] = [
      { id: '1', score: 10, finishedAt: 1000 },
      { id: '2', score: 5, finishedAt: 2000 },
    ]

    mockedFetchResults.mockResolvedValueOnce(mockData)

    render(<TestComponent />, { wrapper: QueryProviderWrapper })

    expect(screen.getByText('LOADING')).toBeTruthy()

    const dataNode = await screen.findByText(/DATA:/)
    expect(dataNode.textContent).toContain('DATA:')
    expect(dataNode.textContent).toContain('10')
    expect(dataNode.textContent).toContain('5')
  })

  it('handles failed localStorage fetch gracefully', async () => {
    function TestComponentWithAuth() {
      const { data, isFetching, error } = useFetchResults('auth-user-123', 'local-user-456')
      if (isFetching) {
        return <div>LOADING</div>
      }
      if (error) {
        return <div>ERROR</div>
      }
      return <div>DATA: {JSON.stringify(data)}</div>
    }

    const authData: StoredResult[] = [
      { id: '1', score: 15, finishedAt: 3000 },
    ]

    // First call (auth) succeeds, second call (local) fails
    mockedFetchResults.mockResolvedValueOnce(authData)
    mockedFetchResults.mockRejectedValueOnce(new Error('Network error'))

    render(<TestComponentWithAuth />, { wrapper: QueryProviderWrapper })

    expect(screen.getByText('LOADING')).toBeTruthy()

    const dataNode = await screen.findByText(/DATA:/)
    // Should still show auth data even though local fetch failed
    expect(dataNode.textContent).toContain('15')
  })
})
