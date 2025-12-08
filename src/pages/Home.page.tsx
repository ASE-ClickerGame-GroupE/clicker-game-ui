import React from 'react'
import { Box, Button } from '@mui/material'
import { GameSection } from '../components/GameSection'
import { ResultsSection } from '../components/ResultsSection'
import { useStoredResults } from '../hooks/useStoredResults.tsx'
import { useAuth } from '../hooks/useAuth'

const HomePage: React.FC = () => {
  const { results, addResult } = useStoredResults()
  const { logout } = useAuth()

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
      <Box width="100%" display="flex" justifyContent="flex-end">
        <Button color="inherit" onClick={() => { logout() }}>
          Logout
        </Button>
      </Box>
      <GameSection onGameEnd={handleGameEnd} />
      <ResultsSection results={results} />
    </Box>
  )
}

export default HomePage
