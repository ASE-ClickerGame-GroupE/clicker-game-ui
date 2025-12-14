import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Stack } from '@mui/material';

export type RoomManagerProps = {
  onRoomReady: (roomId: string) => void;
};

export const RoomManager: React.FC<RoomManagerProps> = ({ onRoomReady }) => {
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [roomId, setRoomId] = useState('');

  const handleCreateRoom = () => {
    // Generate a random room ID
    const newRoomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setRoomId(newRoomId);
    onRoomReady(newRoomId);
  };

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      onRoomReady(roomId.trim());
    }
  };

  if (mode === 'select') {
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
          Multiplayer Aim Clicker
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Create a room or join an existing one to play with others
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => setMode('create')}
            sx={{
              px: 4,
              borderRadius: 999,
              letterSpacing: '0.1em',
            }}
          >
            CREATE ROOM
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => setMode('join')}
            sx={{
              px: 4,
              borderRadius: 999,
              letterSpacing: '0.1em',
            }}
          >
            JOIN ROOM
          </Button>
        </Stack>
      </Box>
    );
  }

  if (mode === 'create') {
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
          Create a Room
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Click the button below to generate a unique room code
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleCreateRoom}
          sx={{
            px: 4,
            borderRadius: 999,
            letterSpacing: '0.1em',
          }}
        >
          GENERATE ROOM
        </Button>

        <Button
          variant="text"
          size="small"
          onClick={() => setMode('select')}
          sx={{ mt: 1 }}
        >
          Back
        </Button>
      </Box>
    );
  }

  // mode === 'join'
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
        Join a Room
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Enter the room code shared by the host
      </Typography>

      <TextField
        fullWidth
        label="Room Code"
        variant="outlined"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
        sx={{ maxWidth: 400 }}
        autoFocus
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleJoinRoom();
          }
        }}
      />

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          size="large"
          onClick={handleJoinRoom}
          disabled={!roomId.trim()}
          sx={{
            px: 4,
            borderRadius: 999,
            letterSpacing: '0.1em',
          }}
        >
          JOIN
        </Button>
        <Button
          variant="text"
          size="small"
          onClick={() => {
            setMode('select');
            setRoomId('');
          }}
        >
          Back
        </Button>
      </Stack>
    </Box>
  );
};
