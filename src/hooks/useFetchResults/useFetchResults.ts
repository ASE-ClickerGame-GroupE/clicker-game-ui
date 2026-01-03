import { useQuery } from '@tanstack/react-query'
import { fetchResults } from '../../api/fetch-results/fetch-results.ts'
import type { StoredResult } from '../../storage/resultsStorage.ts'

export const useFetchResults = (
  authenticatedUserId?: string | null,
  localStorageUserId?: string
) => {
  const {
    data = [],
    isFetching,
    error,
    refetch,
  } = useQuery<StoredResult[], unknown>({
    queryKey: ['results', authenticatedUserId, localStorageUserId],
    queryFn: async () => {
      const results: StoredResult[] = []

      // Fetch authenticated user's results (priority)
      if (authenticatedUserId) {
        try {
          const authResults = await fetchResults(authenticatedUserId)
          results.push(...authResults)
        } catch (error) {
          console.error('Failed to fetch authenticated results:', error)
        }
      }

      // Fetch localStorage user's results
      if (localStorageUserId && localStorageUserId !== authenticatedUserId) {
        try {
          const localResults = await fetchResults(localStorageUserId)
          results.push(...localResults)
        } catch (error) {
          console.error('Failed to fetch local storage results:', error)
          // Return empty array on failure, don't throw
        }
      }

      return results
    },
    placeholderData: [],
    select: (data) => {
      // Remove duplicates by id, keeping the first occurrence
      const uniqueResults = data.reduce((acc, current) => {
        const existing = acc.find((item) => item.id === current.id)
        if (!existing) {
          acc.push(current)
        }
        return acc
      }, [] as StoredResult[])

      return uniqueResults.sort((a, b) => b.score - a.score)
    },
  })

  return { data, isFetching, error, refetch }
}
