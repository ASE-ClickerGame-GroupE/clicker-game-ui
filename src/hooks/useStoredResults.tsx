import { useCallback, useEffect, useState } from 'react'
import {
  clearResults,
  loadResults,
  saveResult,
  type StoredResult,
} from '../storage/resultsStorage'

export const useStoredResults = () => {
  const [results, setResults] = useState<StoredResult[]>([])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults(loadResults())
  }, [])

  const addResult = useCallback((score: number) => {
    const next = saveResult(score)
    setResults(next)
  }, [])

  const resetResults = useCallback(() => {
    clearResults()
    setResults([])
  }, [])

  return { results, addResult, resetResults }
}
