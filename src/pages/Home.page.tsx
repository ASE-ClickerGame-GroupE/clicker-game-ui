import React from 'react'
import { Box } from '@mui/material'
import { GameSection } from '../components/GameSection'
import { ResultsSection } from '../components/ResultsSection'
import { useFetchResults } from '../hooks/useFetchResults'

const HomePage: React.FC = () => {
  const {
    data: results = [],
    isFetching,
    error,
  } = useFetchResults()

  const handleGameEnd = (score: number) => {
    console.log('Game finished with score:', score)
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
      <ResultsSection
        results={results}
        loading={isFetching}
        error={error}
      />
    </Box>
  )
}

export default HomePage
