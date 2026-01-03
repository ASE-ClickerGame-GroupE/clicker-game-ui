import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Stack, Chip, IconButton, Snackbar } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import targetImage from '../../assets/target.png';
import { useFinishGame } from '../../hooks/useFinishGame/useFinishGame.ts';
import { useStartGame } from '../../hooks/useStartGame/useStartGame.ts';
import type { IStartGameBody } from '../../api/start-game/start-game.ts';
import { useUserId } from '../../hooks/useUserId/useUserId.ts';
import { useStorage, useMutation, useOthers, useSelf } from '../../liveblocks.config';
import { Cursors } from '../Cursors/Cursors';

const GAME_DURATION_SECONDS = 20;

export type MultiplayerGameSectionProps = {
  onGameEnd: (score: number) => void;
  roomId: string;
};

type TargetPosition = { x: number; y: number };

const getRandomPosition = (): TargetPosition => {
  const x = 10 + Math.random() * 80;
  const y = 10 + Math.random() * 80;
  return { x, y };
};

export const MultiplayerGameSection: React.FC<MultiplayerGameSectionProps> = ({
  onGameEnd,
  roomId,
}) => {
  const storedUserId = useUserId();
  const { mutate: finishGameMutate } = useFinishGame();
  const { mutate: startGameMutate } = useStartGame();

  const sessionIdRef = useRef<string>('');
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const others = useOthers();
  const self = useSelf();

  // Get game state from Liveblocks storage
  const isHost = useStorage((root) => root.gameState.hostUserId) === storedUserId;
  const isPlaying = useStorage((root) => root.gameState.isPlaying) ?? false;
  const isGameOver = useStorage((root) => root.gameState.isGameOver) ?? false;
  const timeLeft = useStorage((root) => root.gameState.timeLeft) ?? GAME_DURATION_SECONDS;
  const targetPosition = useStorage((root) => root.gameState.targetPosition) ?? null;
  
  // Convert LiveMap to regular object for display
  const playerScoresMap = useStorage((root) => {
    const scoresObj: Record<string, number> = {};
    if (root.playerScores) {
      root.playerScores.forEach((value, key) => {
        scoresObj[key] = value;
      });
    }
    return scoresObj;
  });

  const [myScore, setMyScore] = useState(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [showCopied, setShowCopied] = useState(false);

  // Mutations to update shared game state
  const startGameMutation = useMutation(({ storage }, targetPos: TargetPosition) => {
    const gameState = storage.get('gameState');
    gameState.update({
      isPlaying: true,
      isGameOver: false,
      timeLeft: GAME_DURATION_SECONDS,
      targetPosition: targetPos,
    });
  }, []);

  const updateTimeLeftMutation = useMutation(({ storage }, newTime: number) => {
    const gameState = storage.get('gameState');
    gameState.set('timeLeft', newTime);
  }, []);

  const endGameMutation = useMutation(({ storage }) => {
    const gameState = storage.get('gameState');
    gameState.update({
      isPlaying: false,
      isGameOver: true,
      targetPosition: null,
    });
  }, []);

  const updateTargetPositionMutation = useMutation(
    ({ storage }, newPos: TargetPosition) => {
      const gameState = storage.get('gameState');
      gameState.set('targetPosition', newPos);
    },
    []
  );

  const incrementMyScoreMutation = useMutation(({ storage }, userId: string) => {
    const playerScores = storage.get('playerScores');
    const currentScore = playerScores.get(userId) ?? 0;
    playerScores.set(userId, currentScore + 1);
  }, []);

  const resetScoresMutation = useMutation(({ storage }) => {
    const playerScores = storage.get('playerScores');
    // Clear all scores by deleting all keys
    const keys = Array.from(playerScores.keys());
    keys.forEach((key) => playerScores.delete(key));
  }, []);

  const startGame = () => {
    if (!isHost) return;

    // Reset all scores
    resetScoresMutation();
    setMyScore(0);

    const newTargetPos = getRandomPosition();
    startGameMutation(newTargetPos);

    const body: IStartGameBody = { user_id: storedUserId };

    startGameMutate(body, {
      onSuccess: (data) => {
        sessionIdRef.current = data.session_id;
        setSessionId(data.session_id);
      },
      onError: (err) => {
        console.error('Failed to start game session', err);
      },
    });
  };

  const handleTargetClick = useCallback(() => {
    if (!isPlaying) return;

    // Increment my score in shared storage
    incrementMyScoreMutation(storedUserId);
    setMyScore((prev) => prev + 1);

    // Move target to new position
    const newPos = getRandomPosition();
    updateTargetPositionMutation(newPos);
  }, [isPlaying, storedUserId, incrementMyScoreMutation, updateTargetPositionMutation]);

  // Timer effect (only host controls the timer)
  useEffect(() => {
    if (!isHost || !isPlaying) return;

    const intervalId = window.setInterval(() => {
      updateTimeLeftMutation(Math.max(0, timeLeft - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isHost, isPlaying, timeLeft, updateTimeLeftMutation]);

  // Game end effect (only host controls game end)
  useEffect(() => {
    if (!isHost || !isPlaying || timeLeft !== 0) return;

    endGameMutation();

    const currentSessionId = sessionIdRef.current || sessionId;
    if (currentSessionId) {
      const finishBody = {
        scores: playerScoresMap, // Send all player scores as object
        session_id: currentSessionId,
        finished_at: Date.now(),
      };

      finishGameMutate(finishBody, {
        onSuccess: () => onGameEnd(myScore),
        onSettled: () => onGameEnd(myScore),
      });
    }
  }, [
    isHost,
    isPlaying,
    timeLeft,
    myScore,
    sessionId,
    endGameMutation,
    finishGameMutate,
    onGameEnd,
    playerScoresMap,
  ]);

  // Get list of all players
  const allPlayers = [
    ...(self
      ? [{ id: self.connectionId, name: self.presence.userName, isMe: true }]
      : []),
    ...others.map((other) => ({
      id: other.connectionId,
      name: other.presence.userName,
      isMe: false,
    })),
  ];

  return (
    <>
      <Cursors isPlaying={isPlaying} gameAreaRef={gameAreaRef} />
      <Box
        sx={{
          width: '100%',
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
        Multiplayer Aim Clicker
      </Typography>

      {/* Room info */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Room Code: <strong>{roomId}</strong>
          </Typography>
          <IconButton
            size="small"
            onClick={() => {
              const url = `${window.location.origin}${window.location.pathname}?room=${roomId}`
              navigator.clipboard.writeText(url)
                .then(() => {
                  setShowCopied(true)
                })
                .catch(() => {
                  alert(`Share this link: ${url}`)
                })
            }}
            sx={{ 
              p: 0.5,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
            title="Copy room link"
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Share this code or link with others to play together
        </Typography>
      </Box>
      
      <Snackbar
        open={showCopied}
        autoHideDuration={2000}
        onClose={() => setShowCopied(false)}
        message="Room link copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Players list */}
      <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
        {allPlayers.map((player) => (
          <Chip
            key={player.id}
            label={player.isMe ? `${player.name} (You)` : player.name}
            color={player.isMe ? 'primary' : 'default'}
            size="small"
          />
        ))}
      </Stack>

      {!isPlaying && !isGameOver && (
        <Box
          sx={{
            width: '100%',
            height: 700,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {isHost ? (
            <>
              <Typography variant="body1" color="text.secondary">
                You are the host. Click START to begin the game for everyone.
              </Typography>
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
                START
              </Button>
            </>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Waiting for host to start the game...
            </Typography>
          )}
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
            <Typography data-testid="score">Your Score: {myScore}</Typography>
            <Typography data-testid="timer">Time left: {timeLeft}s</Typography>
          </Stack>

          {/* All players' scores */}
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            {allPlayers.map((player) => {
              const score = playerScoresMap?.[player.name] ?? 0;
              return (
                <Typography key={player.id} variant="body2" color="text.secondary">
                  {player.name}: {score}
                </Typography>
              );
            })}
          </Stack>

          <Box
            ref={gameAreaRef}
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
          <Typography variant="h6">Game Over!</Typography>
          <Typography>Your Score: {myScore}</Typography>

          {/* Final scores */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Final Scores:
            </Typography>
            {allPlayers.map((player) => {
              const score = playerScoresMap?.[player.name] ?? 0;
              return (
                <Typography key={player.id} variant="body1">
                  {player.name}: {score}
                </Typography>
              );
            })}
          </Box>

          {isHost && (
            <Button
              data-testid="play-again-button"
              variant="contained"
              sx={{ borderRadius: 999, px: { xs: 3, sm: 4 }, mt: 2 }}
              onClick={startGame}
            >
              PLAY AGAIN
            </Button>
          )}
          {!isHost && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Waiting for host to start a new game...
            </Typography>
          )}
        </Box>
      )}
      </Box>
    </>
  );
};
