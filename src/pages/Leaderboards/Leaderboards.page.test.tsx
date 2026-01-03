import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, test } from '@jest/globals'
import LeaderboardsPage from './Leaderboards.page'

describe('LeaderboardsPage', () => {
  test('renders the page title', () => {
    render(<LeaderboardsPage />)

    const title = screen.getByText('Leaderboards')
    expect(title).toBeTruthy()
  })

  test('displays coming soon message', () => {
    render(<LeaderboardsPage />)

    const message = screen.getByText('Coming Soon...')
    expect(message).toBeTruthy()
  })

  test('has proper heading hierarchy', () => {
    render(<LeaderboardsPage />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toBe('Leaderboards')
  })
})

