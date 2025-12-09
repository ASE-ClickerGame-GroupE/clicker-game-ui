import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, expect, test, jest, beforeEach } from '@jest/globals'
import { useStartGame } from './useStartGame.ts'
import {
  startGame,
  type IStartGameBody,
  type IStartGameResponse,
} from '../../api/start-game/start-game.ts'
import { QueryProviderWrapper } from '../../test-helpers/wrappers.tsx'

jest.mock('../../api/start-game/start-game.ts')

const mockedStartGame = startGame as jest.MockedFunction<typeof startGame>

describe('useStartGame', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('calls startGame with given body and exposes session_id in data', async () => {
    const response: IStartGameResponse = { session_id: 'session-123' }
    mockedStartGame.mockResolvedValue(response)

    const { result } = renderHook(() => useStartGame(), {
      wrapper: QueryProviderWrapper,
    })

    const body: IStartGameBody = { user_id: 'user-abc' }

    act(() => {
      result.current.mutate(body)
    })

    await waitFor(() => {
      expect(mockedStartGame).toHaveBeenCalledTimes(1)
      expect(mockedStartGame).toHaveBeenCalledWith(body)
      expect(result.current.data).toEqual(response)
    })
  })
})
