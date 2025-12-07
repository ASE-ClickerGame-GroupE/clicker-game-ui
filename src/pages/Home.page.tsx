import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Typography, Paper, Stack } from '@mui/material'
import targetImage from '../../public/target.png'

const GAME_DURATION_SECONDS = 5

type TargetPosition = {
  x: number
  y: number
}

const getRandomPosition = (): TargetPosition => {
  const x = 10 + Math.random() * 80
  const y = 10 + Math.random() * 80
  return { x, y }
}

const HomePage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION_SECONDS)
  const [targetPosition, setTargetPosition] = useState<TargetPosition | null>(
    null
  )

  const startGame = () => {
    setIsPlaying(true)
    setIsGameOver(false)
    setScore(0)
    setTimeLeft(GAME_DURATION_SECONDS)
    setTargetPosition(getRandomPosition())
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

  // Separate effect to handle game over when time runs out
  useEffect(() => {
    if (isPlaying && timeLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false)
      setIsGameOver(true)
      setTargetPosition(null)
    }
  }, [isPlaying, timeLeft])

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ xs: 2, sm: 4 }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 900,
          px: { xs: 3, sm: 5, md: 6 },
          py: { xs: 3, sm: 4 },
          borderRadius: 4,
          textAlign: 'center',
          bgcolor: 'rgba(15,23,42,0.9)',
        }}
      >
        <Typography
          variant="h5"
          fontWeight={500}
          gutterBottom
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
        >
          Aim Clicker
        </Typography>

        {!isPlaying && !isGameOver && (
          <Button
            data-testid="play-button"
            variant="contained"
            size="large"
            onClick={startGame}
            sx={{
              mt: 3,
              px: { xs: 4, sm: 6 },
              borderRadius: 999,
              letterSpacing: '0.1em',
            }}
          >
            PLAY
          </Button>
        )}

        {isPlaying && (
          <>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 3 }}
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 2, mb: 1 }}
            >
              <Typography data-testid="score">Score: {score}</Typography>
              <Typography data-testid="timer">
                Time left: {timeLeft}s
              </Typography>
            </Stack>

            <Box
              data-testid="game-area"
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: { xs: 320, sm: 480, md: 600 },
                height: { xs: 240, sm: 320, md: 400 },
                borderRadius: 3,
                bgcolor: '#020617',
                boxShadow: 'inset 0 0 0 1px rgba(148,163,184,0.4)',
                overflow: 'hidden',
                mt: 1,
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
              mt: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography>Game over!</Typography>
            <Typography>Score: {score}</Typography>
            <Button
              data-testid="play-again-button"
              variant="contained"
              onClick={startGame}
              sx={{ borderRadius: 999, px: { xs: 3, sm: 4 } }}
            >
              Play again
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default HomePage
