import { renderHook, act } from '@testing-library/react'
import { useStoredResults } from './useStoredResults.tsx'
import * as storage from '../storage/resultsStorage'

describe('useStoredResults', () => {
  const loadSpy = jest.spyOn(storage, 'loadResults')
  const saveSpy = jest.spyOn(storage, 'saveResult')
  const clearSpy = jest.spyOn(storage, 'clearResults')

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

  test('resetResults clears storage and resets state', () => {
    loadSpy.mockReturnValue([
      { id: '1', score: 3, finishedAt: 1 },
    ])

    const { result } = renderHook(() => useStoredResults())

    expect(result.current.results).toHaveLength(1)

    act(() => {
      result.current.resetResults()
    })

    expect(clearSpy).toHaveBeenCalledTimes(1)
    expect(result.current.results).toEqual([])
  })
})
