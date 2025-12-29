export type GameDurationSeconds = 5 | 30 | 60

export const DEFAULT_GAME_DURATION_SECONDS: GameDurationSeconds = 5

export const GAME_DURATION_OPTIONS: GameDurationSeconds[] = [5, 30, 60]

export const formatDurationLabel = (seconds: GameDurationSeconds): string =>
  `${seconds}s`
