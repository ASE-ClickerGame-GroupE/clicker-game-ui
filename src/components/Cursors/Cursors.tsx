import React, { useCallback, useEffect } from 'react';
import { useOthers, useUpdateMyPresence } from '../../liveblocks.config';
import { Box, Typography } from '@mui/material';

export type CursorsProps = {
  isPlaying: boolean;
  gameAreaRef?: React.RefObject<HTMLElement | null>;
};

export const Cursors: React.FC<CursorsProps> = ({ isPlaying, gameAreaRef }) => {
  const others = useOthers();
  const updateMyPresence = useUpdateMyPresence();

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isPlaying || !gameAreaRef?.current) {
        updateMyPresence({ cursor: null });
        return;
      }

      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only track cursor if it's within the game area bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        // Store as percentage relative to game area
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        updateMyPresence({
          cursor: {
            xPercent,
            yPercent,
          },
        });
      } else {
        updateMyPresence({ cursor: null });
      }
    },
    [updateMyPresence, isPlaying, gameAreaRef]
  );

  const handlePointerLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  useEffect(() => {
    if (!isPlaying) {
      updateMyPresence({ cursor: null });
      return;
    }

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      updateMyPresence({ cursor: null });
    };
  }, [handlePointerMove, handlePointerLeave, isPlaying, updateMyPresence]);

  return (
    <>
      {isPlaying && others.map((other) => {
        if (!other.presence.cursor || !gameAreaRef?.current) return null;

        const rect = gameAreaRef.current.getBoundingClientRect();
        
        // Convert percentage back to absolute position for this screen
        const absoluteX = rect.left + (other.presence.cursor.xPercent / 100) * rect.width;
        const absoluteY = rect.top + (other.presence.cursor.yPercent / 100) * rect.height;

        return (
          <Box
            key={other.connectionId}
            sx={{
              position: 'fixed',
              left: 0,
              top: 0,
              pointerEvents: 'none',
              zIndex: 9999,
              transform: `translate(${absoluteX}px, ${absoluteY}px)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            {/* Cursor pointer */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            >
              <path
                d="M5.65376 12.3673L8.40372 19.134C8.4935 19.3701 8.75071 19.5 9.01034 19.5C9.26997 19.5 9.52718 19.3701 9.61696 19.134L12.3669 12.3673L19.1336 9.61733C19.3697 9.52755 19.4996 9.27034 19.4996 9.01071C19.4996 8.75108 19.3697 8.49387 19.1336 8.40409L12.3669 5.65413L9.61696 -1.11284e-07C9.52718 -3.46059e-07 9.26997 -5.80834e-07 9.01034 -8.15609e-07C8.75071 -1.05038e-06 8.4935 -1.28516e-06 8.40372 -1.51993e-06L5.65376 5.65413L-1.11284e-07 8.40409C-3.46059e-07 8.49387 -5.80834e-07 8.75108 -8.15609e-07 9.01071C-1.05038e-06 9.27034 -1.28516e-06 9.52755 -1.51993e-06 9.61733L5.65376 12.3673Z"
                fill={other.presence.color}
              />
            </svg>

            {/* User name label */}
            <Box
              sx={{
                position: 'absolute',
                top: 24,
                left: 8,
                bgcolor: other.presence.color,
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              <Typography fontSize="0.75rem" fontWeight={500}>
                {other.presence.userName}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </>
  );
};
