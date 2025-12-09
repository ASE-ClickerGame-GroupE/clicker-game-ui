import { renderHook, waitFor } from '@testing-library/react'
import {
  describe,
  expect,
  test,
  beforeEach,
  jest,
  afterEach,
} from '@jest/globals'
import { useUserId } from './useUserId.ts'

const STORAGE_KEY = 'user_id'

describe('useUserId', () => {
  let originalCrypto: Crypto
  let originalMathRandom: { (): number; (): number }

  beforeEach(() => {
    // preserve originals
    originalCrypto = globalThis.crypto
    originalMathRandom = Math.random

    // clear localStorage
    window.localStorage.clear()
    jest.resetAllMocks()
  })

  afterEach(() => {
    // restore
    try {
      if (originalCrypto === undefined) {
        // delete if it was not originally present
        delete globalThis.crypto
      } else {
        globalThis.crypto = originalCrypto
      }
    } catch {
      // ignore
    }

    Math.random = originalMathRandom
    jest.restoreAllMocks()
  })

  test('returns existing user_id from localStorage and does not overwrite it', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'existing-id-123')

    const { result } = renderHook(() => useUserId())

    await waitFor(() => {
      expect(result.current).toBe('existing-id-123')
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('existing-id-123')
  })

  test('generates and stores id using crypto.randomUUID when available', async () => {
    // Spy on window.crypto.randomUUID if possible
    if (
      typeof window !== 'undefined' &&
      window.crypto &&
      window.crypto.randomUUID
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      jest.spyOn(window.crypto, 'randomUUID').mockReturnValue('uuid-abc-123')
    } else {
      // define a crypto with randomUUID
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      globalThis.crypto = { randomUUID: () => 'uuid-abc-123' }
    }

    const { result } = renderHook(() => useUserId())

    await waitFor(() => {
      expect(result.current).toBe('uuid-abc-123')
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('uuid-abc-123')
  })

  test('falls back to Math.random when crypto.randomUUID is unavailable and stores generated id', async () => {
    // Make randomUUID throw so the hook falls back to Math.random
    if (
      typeof window !== 'undefined' &&
      window.crypto &&
      window.crypto.randomUUID
    ) {
      jest.spyOn(window.crypto, 'randomUUID').mockImplementation(() => {
        throw new Error('nope')
      })
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      globalThis.crypto = {
        randomUUID: () => {
          throw new Error('nope')
        },
      }
    }

    // make Math.random deterministic
    const mockValue = 0.123456789
    Math.random = jest.fn(() => mockValue)

    const expected = mockValue.toString(36).slice(2)

    const { result } = renderHook(() => useUserId())

    await waitFor(() => {
      expect(result.current).toBe(expected)
    })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(expected)
  })
})
