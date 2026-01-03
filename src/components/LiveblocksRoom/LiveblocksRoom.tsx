import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import { RoomProvider } from '../../liveblocks.config';
import { useUserId } from '../../hooks/useUserId/useUserId';
import { useAuth } from '../../hooks/useAuth/useAuth';
import { ClientSideSuspense } from '@liveblocks/react';
import { LiveObject, LiveMap } from '@liveblocks/client';
import { Box, CircularProgress } from '@mui/material';
import { getDisplayName } from '../../utils/displayName';

type LiveblocksRoomProps = {
  roomId: string;
  children: ReactNode;
};

// Generate random color for user
const getRandomColor = () => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B739',
    '#52B788',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const LiveblocksRoom: React.FC<LiveblocksRoomProps> = ({
  roomId,
  children,
}) => {
  const userId = useUserId();
  const { user } = useAuth();

  // Generate a random color for this user (memoized so it doesn't change)
  const userColor = useMemo(() => getRandomColor(), []);

  // Get display name: real username for authenticated users, animal name for others
  const userName = useMemo(() => getDisplayName(userId, user), [userId, user]);

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
        userName,
        userId,
        color: userColor,
      }}
      initialStorage={() => ({
        gameState: new LiveObject({
          isPlaying: false,
          isGameOver: false,
          timeLeft: 20,
          targetPosition: null,
          hostUserId: userId, // First person to join becomes host
        }),
        playerScores: new LiveMap<string, number>(),
      })}
    >
      <ClientSideSuspense
        fallback={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress />
          </Box>
        }
      >
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};
