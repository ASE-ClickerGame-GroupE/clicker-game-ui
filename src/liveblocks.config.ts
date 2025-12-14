import { createClient, LiveObject, LiveMap } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Get public API key from environment variable or window object (for GitHub Pages)
const getPublicApiKey = () => {
  // Try environment variable first (for local development)
  if (import.meta.env.VITE_LIVEBLOCKS_API_KEY) {
    return import.meta.env.VITE_LIVEBLOCKS_API_KEY;
  }
  
  // Fallback to window object for production (GitHub Pages)
  if (typeof window !== 'undefined' && 'LIVEBLOCKS_PUBLIC_KEY' in window) {
    return window.LIVEBLOCKS_PUBLIC_KEY;
  }
  
  // Default key for GitHub Pages deployment
  return import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY || "";
};

const client = createClient({
  publicApiKey: getPublicApiKey(),
});

// Declare Liveblocks types for the application
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      cursor: { xPercent: number; yPercent: number } | null;
      userName: string;
      color: string;
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      gameState: LiveObject<{
        isPlaying: boolean;
        isGameOver: boolean;
        timeLeft: number;
        targetPosition: { x: number; y: number } | null;
        hostUserId: string | null;
      }>;
      playerScores: LiveMap<string, number>;
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      info: {};
    };

    // Custom events, for useBroadcastEvent, useEventListener
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    RoomEvent: {};
  }
}

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useOthers,
    useSelf,
    useStorage,
    useMutation,
  },
} = createRoomContext(client);
