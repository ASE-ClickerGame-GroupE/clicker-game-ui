import axios from 'axios'

export const addResult = async (score: number): Promise<void> => {
  await axios.post('/api/results', { score })
}
