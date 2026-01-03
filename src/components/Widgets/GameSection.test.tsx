jest.mock('../../assets/target.png', () => 'mock-target-image')
jest.mock('../../hooks/useStartGame/useStartGame.ts')
jest.mock('../../hooks/useFinishGame/useFinishGame.ts')
jest.mock('../../hooks/useAuth/useAuth.tsx', () => ({
  useAuth: () => ({
    token: null,
    isAuthenticated: false,
    user: null,
    userId: null,
    isLoadingUser: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}))

import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import {
  describe,
  expect,
  test,
  jest,
  beforeEach,
  afterEach,
} from '@jest/globals'

import { GameSection } from './GameSection.tsx'
import { useStartGame } from '../../hooks/useStartGame/useStartGame.ts'
import { useFinishGame } from '../../hooks/useFinishGame/useFinishGame.ts'
import type { IStartGameBody } from '../../api/start-game/start-game.ts'
import type { IFinishGameBody } from '../../api/finish-game/finish-game.ts'

type StartGameOnSuccess = (data: { session_id: string }) => void
type StartGameOptions = { onSuccess?: StartGameOnSuccess; onError?: (e: unknown) => void }
type StartGameMutate = (body: IStartGameBody, options?: StartGameOptions) => void

type FinishGameOptions = { onSuccess?: () => void; onSettled?: () => void }
type FinishGameMutate = (body: IFinishGameBody, options?: FinishGameOptions) => void

const mockedUseStartGame = useStartGame as unknown as jest.MockedFunction<
  typeof useStartGame
>
const mockedUseFinishGame = useFinishGame as unknown as jest.MockedFunction<
  typeof useFinishGame
>

const mockStartGameMutate = jest.fn<StartGameMutate>()
const mockFinishGameMutate = jest.fn<FinishGameMutate>()

describe('GameSection', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    mockStartGameMutate.mockImplementation((_body, options) => {
      options?.onSuccess?.({ session_id: 'session-123' })
    })

    mockFinishGameMutate.mockImplementation((_body, options) => {
      options?.onSuccess?.()
      options?.onSettled?.()
    })

    mockedUseStartGame.mockReturnValue({
      mutate: mockStartGameMutate,
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useStartGame>)

    mockedUseFinishGame.mockReturnValue({
      mutate: mockFinishGameMutate,
      isPending: false,
      error: null,
    } as unknown as ReturnType<typeof useFinishGame>)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('shows settings and play button initially', () => {
    render(<GameSection onGameEnd={jest.fn()} />)

    expect(screen.getByText(/Game Duration/i)).toBeTruthy()
    expect(screen.getByTestId('duration-5s')).toBeTruthy()
    expect(screen.getByTestId('duration-30s')).toBeTruthy()
    expect(screen.getByTestId('duration-60s')).toBeTruthy()

    expect(screen.getByTestId('play-button')).toBeTruthy()

    expect(screen.queryByTestId('game-area')).toBeNull()
    expect(screen.queryByTestId('game-over')).toBeNull()
  })

  test('clicking PLAY starts the game and calls startGame mutation with user_id', () => {
    render(<GameSection onGameEnd={jest.fn()} />)

    fireEvent.click(screen.getByTestId('play-button'))

    expect(mockStartGameMutate).toHaveBeenCalledTimes(1)

    const [body, options] = mockStartGameMutate.mock.calls[0]

    expect(typeof body.user_id).toBe('string')
    expect(body.user_id.length).toBeGreaterThan(0)

    expect(options).toBeDefined()
    expect(typeof options?.onSuccess).toBe('function')

    expect(screen.getByTestId('game-area')).toBeTruthy()
  })

  test('when time runs out (default 5s), calls finishGame and triggers onGameEnd, then shows change settings button', async () => {
    jest.useFakeTimers()

    const onGameEnd = jest.fn()

    render(<GameSection onGameEnd={onGameEnd} />)

    fireEvent.click(screen.getByTestId('play-button'))

    fireEvent.click(screen.getByTestId('target'))

    await act(async () => {
      jest.advanceTimersByTime(6000)
      await Promise.resolve()
    })

    expect(screen.getByTestId('game-over')).toBeTruthy()
    expect(screen.getByTestId('change-settings-button')).toBeTruthy()
    expect(screen.getByTestId('play-again-button')).toBeTruthy()

    // onGameEnd is called twice - once in onSuccess and once in onSettled
    expect(onGameEnd).toHaveBeenCalledTimes(2)
    expect(onGameEnd).toHaveBeenCalledWith(1)

    expect(mockFinishGameMutate).toHaveBeenCalledTimes(1)

    const [finishBody] = mockFinishGameMutate.mock.calls[0]
    expect(finishBody.session_id).toBe('session-123')
    expect(finishBody.scores).toBe(1)
    expect(typeof finishBody.finished_at).toBe('number')
  })

  test('clicking CHANGE SETTINGS returns to settings screen', async () => {
    jest.useFakeTimers()

    render(<GameSection onGameEnd={jest.fn()} />)

    fireEvent.click(screen.getByTestId('play-button'))

    await act(async () => {
      jest.advanceTimersByTime(6000)
      await Promise.resolve()
    })

    expect(screen.getByTestId('game-over')).toBeTruthy()

    fireEvent.click(screen.getByTestId('change-settings-button'))

    expect(screen.getByTestId('duration-5s')).toBeTruthy()
    expect(screen.getByTestId('play-button')).toBeTruthy()

    expect(screen.queryByTestId('game-over')).toBeNull()
  })
})
