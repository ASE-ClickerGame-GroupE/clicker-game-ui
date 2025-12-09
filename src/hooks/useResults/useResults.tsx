import { useStoredResults } from '../useStoredResults/useStoredResults.tsx'
import { useFetchResults } from '../useFetchResults/useFetchResults.ts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addResult as addResultApi } from '../../api/add-results/add-results.ts'
import type { StoredResult } from '../../storage/resultsStorage.ts'

type UseResultsReturn = {
  results: StoredResult[]
  addResult: (score: number) => void
  isFetching: boolean
  error: unknown
}

export const useResults = (isAuthenticated: boolean): UseResultsReturn => {
  const queryClient = useQueryClient()

  const {
    results: storedResults,
    addResult: addStoredResult,
  } = useStoredResults()

  const {
    data: fetchedResults,
    isFetching,
    error,
  } = useFetchResults()

  const addResultMutation = useMutation({
    mutationKey: ['addResult'],
    mutationFn: addResultApi,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['results'] })
    },
  })

  if (!isAuthenticated) {
    return {
      results: storedResults,
      addResult: addStoredResult,
      isFetching: false,
      error: null,
    }
  }

  return {
    results: fetchedResults ?? [],
    addResult: (score: number) => addResultMutation.mutate(score),
    isFetching,
    error,
  }
}
