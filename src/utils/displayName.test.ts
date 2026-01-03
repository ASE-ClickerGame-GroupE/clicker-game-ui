import { getDisplayName } from './displayName'
import type { UserResponse } from '../api/auth/auth'

describe('getDisplayName', () => {
  it('returns authenticated user login when user is authenticated', () => {
    const userId = 'user-123'
    const authenticatedUser: UserResponse = {
      user_id: 'auth-user-456',
      loging: 'CoolPlayer',
      email: 'player@example.com',
      created_at: 1234567890,
    }

    const displayName = getDisplayName(userId, authenticatedUser)

    expect(displayName).toBe('CoolPlayer')
  })

  it('returns animal name when user is not authenticated', () => {
    const userId = 'user-123'

    const displayName = getDisplayName(userId, null)

    expect(displayName).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/)
  })

  it('returns animal name when authenticated user has no loging', () => {
    const userId = 'user-123'
    const authenticatedUser: UserResponse = {
      user_id: 'auth-user-456',
      loging: '',
      email: 'player@example.com',
      created_at: 1234567890,
    }

    const displayName = getDisplayName(userId, authenticatedUser)

    expect(displayName).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/)
  })

  it('generates consistent names for same userId when unauthenticated', () => {
    const userId = 'user-123'

    const name1 = getDisplayName(userId, null)
    const name2 = getDisplayName(userId, null)

    expect(name1).toBe(name2)
  })
})

