import { generateAnimalName } from './animalNames'
import type { UserResponse } from '../api/auth/auth'

/**
 * Gets display name for a user
 * - For authenticated users: returns their real username (loging field)
 * - For unauthenticated users: generates a fun animal name
 */
export const getDisplayName = (
  userId: string,
  authenticatedUser?: UserResponse | null
): string => {
  // If user is authenticated and we have their info, use their real username
  if (authenticatedUser && authenticatedUser.loging) {
    return authenticatedUser.loging
  }

  // Otherwise, generate an animal name from their ID
  return generateAnimalName(userId)
}

