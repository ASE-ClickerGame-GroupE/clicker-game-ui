import React from 'react'
import { describe, expect, test, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import LeaderboardsPage from './Leaderboards.page'

jest.mock('../../components/Widgets/LeaderboardCard.tsx', () => ({
  __esModule: true,
  default: function MockLeaderboardCard() {
    return <div data-testid="leaderboard-card" />
  },
}))

describe('LeaderboardsPage', () => {
  test('renders title and leaderboard card', () => {
    render(<LeaderboardsPage />)

    expect(screen.getByRole('heading', { name: /leaderboards/i })).toBeTruthy()
    expect(screen.getByTestId('leaderboard-card')).toBeTruthy()
  })
})
