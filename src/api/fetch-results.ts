import result from '../assets/results.json'

export interface IResult {
  id: string
  scores: number
  // Timestamp in milliseconds
  finishedAt: number
}

export const fetchResults = async (): Promise<{ data: IResult[] }> => {
  return new Promise((resolve) => {
    resolve({ data: result })
  })
}
