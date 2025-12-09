import { useEffect, useState } from 'react'

const STORAGE_KEY = 'user_id'

const createUserId = (): string => {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return (crypto as Crypto).randomUUID()
    }
  } catch {
    // ignore
  }
  return Math.random().toString(36).slice(2)
}

export function useUserId(): string {
  const [userId, setUserId] = useState<string>(() => {
    try {
      const existing = window.localStorage.getItem(STORAGE_KEY)
      return existing ?? ''
    } catch {
      // Ignore localStorage access errors
    }
    return ''
  })

  useEffect(() => {
    if (userId) {
      return
    }

    try {
      let id = window.localStorage.getItem(STORAGE_KEY)
      if (!id) {
        id = createUserId()
        window.localStorage.setItem(STORAGE_KEY, id)
      }
      setUserId(id)
    } catch {
      const id = createUserId()
      setUserId(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return userId
}
