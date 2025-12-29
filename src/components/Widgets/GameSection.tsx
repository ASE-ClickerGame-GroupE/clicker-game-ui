import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Typography, Stack } from '@mui/material'
import targetImage from '../../assets/target.png'
import { useFinishGame } from '../../hooks/useFinishGame/useFinishGame.ts'
import { useStartGame } from '../../hooks/useStartGame/useStartGame.ts'
import type { IStartGameBody } from '../../api/start-game/start-game.ts'
import { useUserId } from '../../hooks/useUserId/useUserId.ts'
import {
  DEFAULT_GAME_DURATION_SECONDS,
  GAME_DURATION_OPTIONS,
  formatDurationLabel,
  type GameDurationSeconds,
} from '../../utils/gameSettings.ts'


export type GameSectionProps = {
  onGameEnd: (score: number) => void
}

type TargetPosition = { x: number; y: number }

const getRandomPosition = (): TargetPosition => {
  const x = 10 + Math.random() * 80
  const y = 10 + Math.random() * 80
  return { x, y }
}

export const GameSection: React.FC<GameSectionProps> = ({ onGameEnd }) => {
  const storedUserId = useUserId()
  const { mutate: finishGameMutate } = useFinishGame()
  const { mutate: startGameMutate } = useStartGame()

  const sessionIdRef = useRef<string>('')
  const [sessionId, setSessionId] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [showSettings, setShowSettings] = useState(true)
  const [selectedDuration, setSelectedDuration] = useState<GameDurationSeconds>(
    DEFAULT_GAME_DURATION_SECONDS
  )
  const [timeLeft, setTimeLeft] = useState<number>(
    DEFAULT_GAME_DURATION_SECONDS
  )
  const [targetPosition, setTargetPosition] = useState<TargetPosition | null>(
    null
  )

  const startGame = () => {
    setShowSettings(false)
    setIsPlaying(true)
    setIsGameOver(false)
    setScore(0)
    setTimeLeft(selectedDuration)
    setTargetPosition(getRandomPosition())

    const body: IStartGameBody = { user_id: storedUserId }

    startGameMutate(body, {
      onSuccess: (data) => {
        // update ref synchronously so effects that run soon after can see it
        sessionIdRef.current = data.session_id
        setSessionId(data.session_id)
      },
      onError: (err) => {
        console.error('Failed to start game session', err)
      },
    })
  }

  const handleTargetClick = useCallback(() => {
    if (!isPlaying) return
    setScore((prev) => prev + 1)
    setTargetPosition(getRandomPosition())
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) return

    const intervalId = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [isPlaying])

  useEffect(() => {
    if (isPlaying && timeLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false)
      setIsGameOver(true)
      setTargetPosition(null)

      const currentSessionId = sessionIdRef.current || sessionId
      if (!currentSessionId) {
        console.warn('No session_id available when finishing game')
        return
      }

      const finishBody = {
        scores: score,
        session_id: currentSessionId,
        finished_at: Date.now(),
      }

      finishGameMutate(finishBody, {
        onSuccess: () => onGameEnd(score),
        onSettled: () => onGameEnd(score),
      })
    }
  }, [isPlaying, timeLeft, score, onGameEnd, sessionId, finishGameMutate])

  return (
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

      {showSettings && !isPlaying && !isGameOver && (
        <Box
          sx={{
            width: '100%',
            height: 700,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Game Duration
            </Typography>

            <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              {GAME_DURATION_OPTIONS.map((sec) => (
                <Button
                  key={sec}
                  size="small"
                  variant={selectedDuration === sec ? 'contained' : 'outlined'}
                  onClick={() => setSelectedDuration(sec)}
                  data-testid={`duration-${sec}s`}
                  sx={{ borderRadius: 999 }}
                >
                  {formatDurationLabel(sec)}
                </Button>
              ))}
            </Stack>
          </Box>
          <Button
            data-testid="play-button"
            variant="contained"
            size="large"
            onClick={startGame}
            sx={{
              px: { xs: 4, sm: 6 },
              borderRadius: 999,
              letterSpacing: '0.1em',
            }}
          >
            PLAY
          </Button>
        </Box>
      )}

      {isPlaying && (
        <>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 3 }}
            justifyContent="center"
            alignItems="center"
          >
            <Typography data-testid="score">Score: {score}</Typography>
            <Typography data-testid="timer">Time left: {timeLeft}s</Typography>
          </Stack>

          <Box
            data-testid="game-area"
            sx={{
              position: 'relative',
              width: '100%',
              height: 700,
              borderRadius: 3,
              bgcolor: '#020617',
              boxShadow: 'inset 0 0 0 1px rgba(148,163,184,0.4)',
              overflow: 'hidden',
              mx: 'auto',
            }}
          >
            {targetPosition && (
              <Box
                component="img"
                data-testid="target"
                src={targetImage}
                alt="Target"
                onClick={handleTargetClick}
                sx={{
                  position: 'absolute',
                  left: `${targetPosition.x}%`,
                  top: `${targetPosition.y}%`,
                  width: { xs: 30, sm: 35, md: 45 },
                  height: { xs: 30, sm: 35, md: 45 },
                  transform: 'translate(-50%, -50%)',
                  cursor: 'crosshair',
                  userSelect: 'none',
                }}
              />
            )}
          </Box>
        </>
      )}

      {isGameOver && (
        <Box
          data-testid="game-over"
          sx={{
            width: '100%',
            height: 700,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography>Game over!</Typography>
          <Typography>Score: {score}</Typography>
          <Button
            data-testid="play-again-button"
            variant="contained"
            sx={{ borderRadius: 999, px: { xs: 3, sm: 4 } }}
            onClick={startGame}
          >
            PLAY AGAIN
          </Button>
          <Button
            variant="outlined"
            sx={{ borderRadius: 999, px: { xs: 3, sm: 4 } }}
            onClick={() => {
              setIsGameOver(false)
              setShowSettings(true)
            }}
            data-testid="change-settings-button"
          >
            CHANGE SETTINGS
          </Button>
        </Box>
      )}
    </Box>
  )
}
