import { useQuery } from '@tanstack/react-query'
import { fetchResults } from '../../api/fetch-results/fetch-results.ts'
import type { StoredResult } from '../../storage/resultsStorage.ts'

export const useFetchResults = (userId?: string) => {
  const {
    data = [],
    isFetching,
    error,
    refetch,
  } = useQuery<StoredResult[], unknown>({
    queryKey: ['results', userId ?? ''],
    queryFn: async () => await fetchResults(userId ?? ''),
    placeholderData: [],
    select: (data) => {
      return data.sort((a, b) => b.score - a.score)
    },
  })

  return { data, isFetching, error, refetch }
}
