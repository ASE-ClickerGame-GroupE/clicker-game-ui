import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, jest } from '@jest/globals'
import { QueryProviderWrapper } from '../test-helpers/wrappers'
import { useFetchResults } from './useFetchResults'
import { fetchResults } from '../api/fetch-results'
import type { StoredResult } from '../storage/resultsStorage'

jest.mock('../api/fetch-results')

const mockedFetchResults = fetchResults as jest.MockedFunction<typeof fetchResults>

function TestComponent() {
  const { data, isFetching, error } = useFetchResults()
  if (isFetching) {
    return <div>LOADING</div>
  }
  if (error) {
    return <div>ERROR</div>
  }
  return <div>DATA: {JSON.stringify(data)}</div>
}

describe('useFetchResults', () => {
  it('renders data from fetchResults', async () => {
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
})
