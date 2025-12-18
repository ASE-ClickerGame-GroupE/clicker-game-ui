import { createClient, LiveObject, LiveMap } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Get public API key from environment variable or window object (for GitHub Pages)
const getPublicApiKey = () => {
  console.log('[Liveblocks Debug] Environment check:', {
    hasViteApiKey: !!import.meta.env.VITE_LIVEBLOCKS_API_KEY,
    hasVitePublicKey: !!import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasProcessEnv: typeof process !== 'undefined' && !!(process as any).env?.VITE_LIVEBLOCKS_PUBLIC_KEY,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasWindowKey: typeof window !== 'undefined' && !!(window as any).LIVEBLOCKS_PUBLIC_KEY,
    allEnvKeys: Object.keys(import.meta.env).filter(k => k.includes('LIVEBLOCKS')),
  });
  
 // Try process.env (for Node.js/SSR environments)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof process !== 'undefined' && (process as any).env?.VITE_LIVEBLOCKS_PUBLIC_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key = (process as any).env.VITE_LIVEBLOCKS_PUBLIC_KEY;
    console.log('[Liveblocks Debug] Using process.env.VITE_LIVEBLOCKS_PUBLIC_KEY:', key.substring(0, 10) + '...');
    return key;
  }

  // Try environment variable first (for local development)
  if (import.meta.env.VITE_LIVEBLOCKS_API_KEY) {
    const key = import.meta.env.VITE_LIVEBLOCKS_API_KEY;
    console.log('[Liveblocks Debug] Using VITE_LIVEBLOCKS_API_KEY:', key.substring(0, 10) + '...');
    return key;
  }
  
  // Try public key for production
  if (import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY) {
    const key = import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY;
    console.log('[Liveblocks Debug] Using VITE_LIVEBLOCKS_PUBLIC_KEY:', key.substring(0, 10) + '...');
    return key;
  }
  
  // Fallback to window object for production (GitHub Pages)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== 'undefined' && (window as any).LIVEBLOCKS_PUBLIC_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const key = (window as any).LIVEBLOCKS_PUBLIC_KEY;
    console.log('[Liveblocks Debug] Using window.LIVEBLOCKS_PUBLIC_KEY:', key.substring(0, 10) + '...');
    return key;
  }
  
  console.error('[Liveblocks Debug] No API key found!');
  return "";
};

const publicApiKey = getPublicApiKey();
console.log('[Liveblocks Debug] Final key length:', publicApiKey.length, 'starts with pk_:', publicApiKey.startsWith('pk_'));

const client = createClient({
  publicApiKey,
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
