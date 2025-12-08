import React from 'react'
import { Box } from '@mui/material'
import { GameSection } from '../components/GameSection'
import { ResultsSection } from '../components/ResultsSection'
import { useStoredResults } from '../hooks/useStoredResults.tsx'

const HomePage: React.FC = () => {
  const { results, addResult } = useStoredResults()

  const handleGameEnd = (score: number) => {
    addResult(score)
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      px={{ xs: 2, sm: 4 }}
      py={6}
      gap={6}
    >
      <GameSection onGameEnd={handleGameEnd} />
      <ResultsSection results={results} />
    </Box>
  )
}

export default HomePage
