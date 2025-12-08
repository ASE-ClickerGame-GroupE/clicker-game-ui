export type StoredResult = {
  id: string
  score: number
  finishedAt: number
}

const STORAGE_KEY = 'aim-clicker-results'

export const loadResults = (): StoredResult[] => {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (item): item is StoredResult =>
        item &&
        typeof item.id === 'string' &&
        typeof item.score === 'number' &&
        typeof item.finishedAt === 'number'
    )
  } catch {
    return []
  }
}

export const saveResult = (score: number): StoredResult[] => {
  const previous = loadResults()

  const newResult: StoredResult = {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    score,
    finishedAt: Date.now(),
  }

  const next = [newResult, ...previous].sort((a, b) => b.score - a.score)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return next
}

export const clearResults = (): void => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}
