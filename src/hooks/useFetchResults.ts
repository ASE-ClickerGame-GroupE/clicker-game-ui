import { useQuery } from '@tanstack/react-query'
import { fetchResults } from '../api/fetch-results'
import type { StoredResult } from '../storage/resultsStorage'

export const useFetchResults = () => {
  const {
    data = [],
    isFetching,
    error,
  } = useQuery<StoredResult[], unknown>({
    queryKey: ['results'],
    queryFn: fetchResults,
    placeholderData: [],
  })

  return { data, isFetching, error }
}
