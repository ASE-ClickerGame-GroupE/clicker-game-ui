import { useQuery } from '@tanstack/react-query'
import { fetchResults } from '../../api/fetch-results/fetch-results.ts'
import type { StoredResult } from '../../storage/resultsStorage.ts'

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
