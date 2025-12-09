import React from 'react'
import { Box, Button } from '@mui/material'
import { GameSection } from '../../components/Widgets/GameSection.tsx'
import { ResultsSection } from '../../components/Widgets/ResultsSection.tsx'
import { useResults } from '../../hooks/useResults/useResults.tsx'
import { useAuth } from '../../hooks/useAuth/useAuth.tsx'
import { useNavigate } from 'react-router'

const HomePage: React.FC = () => {
  const { logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { results, addResult } = useResults(isAuthenticated)

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
        {isAuthenticated ? (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={() => { navigate('/login') }}>
            Login
          </Button>
        )}
      </Box>
      <GameSection onGameEnd={handleGameEnd} />
      <ResultsSection results={results} />
    </Box>
  )
}

export default HomePage
