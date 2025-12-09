// src/hooks/useStoredResults.test.tsx
import { renderHook, act } from '@testing-library/react'
import { useStoredResults } from './useStoredResults.tsx'
import * as storage from '../../storage/resultsStorage.ts'

describe('useStoredResults', () => {
  const loadSpy = jest.spyOn(storage, 'loadResults')
  const saveSpy = jest.spyOn(storage, 'saveResult')

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('loads initial results from storage on mount', () => {
    loadSpy.mockReturnValue([
      { id: '1', score: 3, finishedAt: 1 },
      { id: '2', score: 5, finishedAt: 2 },
    ])

    const { result } = renderHook(() => useStoredResults())

    expect(loadSpy).toHaveBeenCalledTimes(1)
    expect(result.current.results).toHaveLength(2)
    expect(result.current.results[0].score).toBe(3)
  })

  test('addResult delegates to saveResult and updates state', () => {
    loadSpy.mockReturnValue([])

    const savedResults = [
      { id: '1', score: 7, finishedAt: 1 },
      { id: '2', score: 4, finishedAt: 2 },
    ]
    saveSpy.mockReturnValue(savedResults)

    const { result } = renderHook(() => useStoredResults())

    act(() => {
      result.current.addResult(7)
    })

    expect(saveSpy).toHaveBeenCalledWith(7)
    expect(result.current.results).toEqual(savedResults)
  })
})
