/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../assets/target.png', () => 'mock-target-image')
jest.mock('../hooks/useStartGame.ts')
jest.mock('../hooks/useFinishGame.ts')

import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals'
import { GameSection } from './GameSection'
import { useStartGame } from '../hooks/useStartGame.ts'
import { useFinishGame } from '../hooks/useFinishGame.ts'
import type { IStartGameBody } from '../api/start-game'
import type { IFinishGameBody } from '../api/finish-game'

const mockedUseStartGame = useStartGame as jest.MockedFunction<typeof useStartGame>
const mockedUseFinishGame = useFinishGame as jest.MockedFunction<typeof useFinishGame>

const mockStartGameMutate = jest.fn()
const mockFinishGameMutate = jest.fn()

describe('GameSection', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    mockedUseStartGame.mockReturnValue({
      mutate: mockStartGameMutate,
      isPending: false,
      error: null,
    } as any)

    mockedUseFinishGame.mockReturnValue({
      mutate: mockFinishGameMutate,
      isPending: false,
      error: null,
    } as any)
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('shows only play button initially', () => {
    render(<GameSection onGameEnd={jest.fn()} />)

    expect(screen.getByTestId('play-button')).toBeTruthy()
    expect(screen.queryByTestId('game-area')).toBeNull()
    expect(screen.queryByTestId('game-over')).toBeNull()
  })

  test('clicking PLAY starts the game and calls startGame mutation with user_id', () => {
    render(<GameSection onGameEnd={jest.fn()} />)

    fireEvent.click(screen.getByTestId('play-button'))

    expect(mockStartGameMutate).toHaveBeenCalledTimes(1)

    const callArgs = mockStartGameMutate.mock.calls[0] as any[]
    const body = callArgs[0] as IStartGameBody
    const options = callArgs[1] as any

    expect(typeof body.user_id).toBe('string')
    expect(body.user_id.length).toBeGreaterThan(0)

    expect(options).toBeDefined()
    expect(typeof options.onSuccess).toBe('function')
  })

  test('when time runs out, calls finishGame with session_id, scores and finished_at and triggers onGameEnd', () => {
    jest.useFakeTimers()

    mockStartGameMutate.mockImplementation((_body: any, options?: any) => {
      if (options && typeof options.onSuccess === 'function') {
        options.onSuccess({ session_id: 'session-123' })
      }
    })

    const onGameEnd = jest.fn()

    render(<GameSection onGameEnd={onGameEnd} />)

    fireEvent.click(screen.getByTestId('play-button'))

    const target = screen.getByTestId('target')
    fireEvent.click(target)

    act(() => {
      jest.advanceTimersByTime(5000)
    })

    expect(screen.getByTestId('game-over')).toBeTruthy()

    expect(onGameEnd).toHaveBeenCalledTimes(1)
    expect(onGameEnd).toHaveBeenCalledWith(1)

    expect(mockFinishGameMutate).toHaveBeenCalledTimes(1)

    const [finishBody] = mockFinishGameMutate.mock.calls[0] as any[]
    const typedFinishBody = finishBody as IFinishGameBody

    expect(typedFinishBody.session_id).toBe('session-123')
    expect(typedFinishBody.scores).toBe(1)
    expect(typeof typedFinishBody.finished_at).toBe('number')
  })
})
