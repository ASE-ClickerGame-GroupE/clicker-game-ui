import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  Stack
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import GroupIcon from '@mui/icons-material/Group'
import { GameSection } from '../../components/Widgets/GameSection.tsx'
import { MultiplayerGameSection } from '../../components/Widgets/MultiplayerGameSection.tsx'
import { ResultsSection } from '../../components/Widgets/ResultsSection.tsx'
import { RoomManager } from '../../components/RoomManager/RoomManager.tsx'
import { LiveblocksRoom } from '../../components/LiveblocksRoom/LiveblocksRoom.tsx'
import { useResults } from '../../hooks/useResults/useResults.tsx'
import { useAuth } from '../../hooks/useAuth/useAuth.tsx'
import { useSearchParams } from 'react-router'

const HomePage: React.FC = () => {
  // eslint-disable-next-line no-empty-pattern
  const {
    // logout,
    // isAuthenticated,
  } = useAuth()
  // const navigate = useNavigate()
  const { results, addResult, refetch } = useResults(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [roomId, setRoomId] = useState<string | null>(null)
  const [gameMode, setGameMode] = useState<'select' | 'single' | 'multiplayer'>('select')

  // Check URL for room ID on mount
  useEffect(() => {
    const urlRoomId = searchParams.get('room')
    if (urlRoomId) {
      setRoomId(urlRoomId)
      setGameMode('multiplayer')
    }
  }, [])

  const handleGameEnd = async (score: number) => {
    if (refetch) {
      await refetch?.()
    } else {
      addResult?.(score)
    }
  }

  const handleRoomReady = (newRoomId: string) => {
    setRoomId(newRoomId)
    // Update URL with room ID
    setSearchParams({ room: newRoomId })
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
      {gameMode === 'select' && (
        <Box
          sx={{
            width: '100%',
            maxWidth: 900,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            bgcolor: 'rgba(15,23,42,0.9)',
            px: { xs: 3, sm: 5, md: 6 },
            py: { xs: 4, sm: 5 },
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight={500}>
            Aim Clicker
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Choose your game mode
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2, width: '100%', maxWidth: 500 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PersonIcon />}
              onClick={() => setGameMode('single')}
              sx={{
                flex: 1,
                py: 2,
                borderRadius: 2,
                letterSpacing: '0.1em',
              }}
            >
              SINGLE PLAYER
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<GroupIcon />}
              onClick={() => setGameMode('multiplayer')}
              sx={{
                flex: 1,
                py: 2,
                borderRadius: 2,
                letterSpacing: '0.1em',
              }}
            >
              MULTIPLAYER
            </Button>
          </Stack>
        </Box>
      )}

      {gameMode === 'single' && (
        <GameSection onGameEnd={handleGameEnd} />
      )}

      {gameMode === 'multiplayer' && !roomId && (
        <RoomManager onRoomReady={handleRoomReady} />
      )}

      {gameMode === 'multiplayer' && roomId && (
        <LiveblocksRoom roomId={roomId}>
          <MultiplayerGameSection onGameEnd={handleGameEnd} roomId={roomId} />
        </LiveblocksRoom>
      )}
      
      {gameMode !== 'select' && <ResultsSection results={results} />}
    </Box>
  )
}

export default HomePage
