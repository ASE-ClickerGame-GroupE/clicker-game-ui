import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, expect, test, jest, beforeEach } from '@jest/globals'
import { useFinishGame } from './useFinishGame.ts'
import {
  finishGame,
  type IFinishGameBody,
} from '../api/finish-game.ts'
import { QueryProviderWrapper } from '../test-helpers/wrappers'

jest.mock('../api/finish-game.ts')

const mockedFinishGame = finishGame as jest.MockedFunction<typeof finishGame>

describe('useFinishGame', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('calls finishGame with given body when mutate is invoked', async () => {
    mockedFinishGame.mockResolvedValue({} as any)

    const { result } = renderHook(() => useFinishGame(), {
      wrapper: QueryProviderWrapper,
    })

    const body: IFinishGameBody = {
      session_id: 'session-123',
      scores: 10,
      finished_at: 1712345678900,
    }

    act(() => {
      result.current.mutate(body)
    })

    await waitFor(() => {
      expect(mockedFinishGame).toHaveBeenCalledTimes(1)
      expect(mockedFinishGame).toHaveBeenCalledWith(body)
    })
  })
})
