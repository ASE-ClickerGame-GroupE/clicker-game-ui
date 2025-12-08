import {
  loadResults,
  saveResult,
  clearResults,
  type StoredResult,
} from './resultsStorage'

describe('resultsStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('loadResults returns empty array when nothing stored', () => {
    const results = loadResults()
    expect(results).toEqual([])
  })

  test('saveResult stores a new result and loadResults returns it', () => {
    const score = 5

    const afterSave = saveResult(score)
    expect(afterSave.length).toBe(1)

    const [stored] = afterSave
    expect(stored.score).toBe(score)
    expect(typeof stored.id).toBe('string')
    expect(typeof stored.finishedAt).toBe('number')

    const loaded = loadResults()
    expect(loaded).toEqual(afterSave)
  })

  test('saveResult keeps results sorted by score (desc)', () => {
    saveResult(1)
    saveResult(10)
    saveResult(7)

    const loaded = loadResults()
    const scores = loaded.map((r: StoredResult) => r.score)

    expect(scores).toEqual([10, 7, 1])
  })

  test('clearResults removes data from storage', () => {
    saveResult(3)
    expect(loadResults().length).toBe(1)

    clearResults()
    expect(loadResults()).toEqual([])
  })
})
