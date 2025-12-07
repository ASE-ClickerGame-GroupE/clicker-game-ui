import { useQuery } from '@tanstack/react-query'
import { fetchResults, type IResult } from '../api/fetch-results.ts'

export const useFetchResults = () => {
  const { data, isFetching, error } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data } = await fetchResults()
      return !data ? [] : data
    },
    placeholderData: [] as IResult[],
  })

  return { data, isFetching, error }
}
