import React from 'react'
import { render, screen } from '@testing-library/react'
import { ResultsSection } from './ResultsSection.tsx'
import type { StoredResult } from '../../storage/resultsStorage.ts'

const makeResult = (overrides?: Partial<StoredResult>): StoredResult => ({
  id: 'test-id',
  score: 10,
  finishedAt: 1700000000000,
  ...overrides,
})

describe('ResultsSection', () => {
  test('shows empty state when there are no results', () => {
    render(<ResultsSection results={[]} />)

    expect(
      screen.getByText(
        /you don't have any results yet\. play a game to see your stats here\./i
      )
    ).toBeInTheDocument()
  })

  test('renders a list item for each result', () => {
    const results: StoredResult[] = [
      makeResult({ id: '1', score: 5 }),
      makeResult({ id: '2', score: 8 }),
    ]

    render(<ResultsSection results={results} />)

    expect(screen.getByText(/your top results/i)).toBeInTheDocument()

    expect(screen.getByText('1.')).toBeInTheDocument()
    expect(screen.getByText('2.')).toBeInTheDocument()

    expect(screen.getByText(/hits: 5/i)).toBeInTheDocument()
    expect(screen.getByText(/hits: 8/i)).toBeInTheDocument()
  })

  test('displays "Singleplayer" for games with 1 player', () => {
    const results: StoredResult[] = [
      makeResult({ id: '1', score: 5, playerCount: 1 }),
    ]

    render(<ResultsSection results={results} />)

    expect(screen.getByText('Singleplayer')).toBeInTheDocument()
  })

  test('displays "Multiplayer" for games with more than 1 player', () => {
    const results: StoredResult[] = [
      makeResult({ id: '1', score: 5, playerCount: 3 }),
      makeResult({ id: '2', score: 8, playerCount: 2 }),
    ]

    render(<ResultsSection results={results} />)

    const multiplayerElements = screen.getAllByText('Multiplayer')
    expect(multiplayerElements).toHaveLength(2)
  })

  test('defaults to "Singleplayer" when playerCount is undefined', () => {
    const results: StoredResult[] = [
      makeResult({ id: '1', score: 5, playerCount: undefined }),
    ]

    render(<ResultsSection results={results} />)

    expect(screen.getByText('Singleplayer')).toBeInTheDocument()
  })
})
