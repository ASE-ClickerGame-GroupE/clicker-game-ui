import { createClient, LiveObject, LiveMap } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_API_KEY || "",
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
      info: Record<string, never>;
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: Record<string, never>;
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
