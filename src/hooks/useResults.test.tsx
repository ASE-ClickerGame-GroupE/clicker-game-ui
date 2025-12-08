import { renderHook, act } from '@testing-library/react'
import { describe, expect, test, jest } from '@jest/globals'
import { useResults } from './useResults'
import type { StoredResult } from '../storage/resultsStorage'

jest.mock('./useStoredResults')
jest.mock('./useFetchResults')
jest.mock('@tanstack/react-query', () => {
  const actual = jest.requireActual('@tanstack/react-query') as typeof import('@tanstack/react-query')
  return {
    ...actual,
    useMutation: jest.fn(),
    useQueryClient: jest.fn(),
  }
})

import { useStoredResults } from './useStoredResults'
import { useFetchResults } from './useFetchResults'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type UseFetchResultsReturn = {
  data: StoredResult[]
  isFetching: boolean
  error: unknown
}

type UseMutationReturn = {
  mutate: (score: number) => void
}

type UseQueryClientReturn = {
  invalidateQueries: (options: { queryKey: unknown[] }) => void
}

const mockedUseStoredResults = useStoredResults as jest.MockedFunction<typeof useStoredResults>
const mockedUseFetchResults = useFetchResults as jest.MockedFunction<() => UseFetchResultsReturn>
const mockedUseMutation = useMutation as unknown as jest.MockedFunction<() => UseMutationReturn>
const mockedUseQueryClient = useQueryClient as unknown as jest.MockedFunction<
  () => UseQueryClientReturn
>

describe('useResults', () => {
  const storedResults: StoredResult[] = [{ id: '1', score: 5, finishedAt: 111 }]

  const fetchedResults: StoredResult[] = [{ id: '2', score: 10, finishedAt: 222 }]

  const addStoredResultMock = jest.fn()
  const mutateMock = jest.fn()
  const invalidateQueriesMock = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()

    mockedUseStoredResults.mockReturnValue({
      results: storedResults,
      addResult: addStoredResultMock,
    })

    mockedUseFetchResults.mockReturnValue({
      data: fetchedResults,
      isFetching: true,
      error: null,
    })

    mockedUseMutation.mockReturnValue({
      mutate: mutateMock,
    })

    mockedUseQueryClient.mockReturnValue({
      invalidateQueries: invalidateQueriesMock,
    })
  })

  test('returns local storage results when user is not authenticated', () => {
    const { result } = renderHook(() => useResults(false))

    expect(result.current.results).toBe(storedResults)
    expect(result.current.isFetching).toBe(false)
    expect(result.current.error).toBeNull()

    act(() => {
      result.current.addResult(7)
    })

    expect(addStoredResultMock).toHaveBeenCalledWith(7)
    expect(mutateMock).not.toHaveBeenCalled()
  })

  test('returns backend results and uses mutation when user is authenticated', () => {
    const { result } = renderHook(() => useResults(true))

    expect(result.current.results).toBe(fetchedResults)
    expect(result.current.isFetching).toBe(true)
    expect(result.current.error).toBeNull()

    act(() => {
      result.current.addResult(15)
    })

    expect(mutateMock).toHaveBeenCalledWith(15)
  })
})
