import { test, expect } from '@playwright/test'
import { BASE_URL } from './test-credentials'

const USER_ID = 'cadeb610-588c-432d-9ef4-62eddcd20ec9'

test.describe('Game Results', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
  })

  test('should show empty state when user has no results', async ({ page }) => {
    // Create a mock user that has no results by intercepting the API
    await page.route('**/game**', async (route) => {
      const req = route.request()
      if (req.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        })
      } else {
        await route.continue()
      }
    })

    // Wait for initial page load
    await page.waitForTimeout(1000)

    const spButton = page.getByRole('button', { name: /single player/i })
    await spButton.first().click()

    await page.waitForTimeout(1000)

    await expect(page.getByText(/you don't have any results yet/i)).toBeVisible(
      { timeout: 5000 }
    )
  })

  test('should display results with correct game type indicators', async ({
    page,
  }) => {
    const mockResults = [
      {
        id: '1',
        finished_at: Date.now() - 1000000,
        scores: { USER_ID: 10 },
      },
      {
        id: '2',
        finished_at: Date.now() - 2000000,
        scores: { USER_ID: 8, 'user-2': 12 },
      },
    ]

    // Mock the API to return controlled results
    await page.route('**/game?user_id=*', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockResults),
        })
      } else {
        await route.continue()
      }
    })

    await page.waitForTimeout(2000)

    const spButton = page.getByRole('button', { name: /single player/i })
    await spButton.first().click()

    // Wait for results to render
    const resultRows = page.getByTestId('result-row')

    await expect(resultRows.first()).toBeVisible({ timeout: 5000 })

    // Check that we have 2 results
    await expect(resultRows).toHaveCount(2)

    // First result should be Singleplayer (1 player in scores)
    await expect(resultRows.first().getByText('Singleplayer')).toBeVisible()

    // Second result should be Multiplayer (2 players in scores)
    await expect(resultRows.nth(1).getByText('Multiplayer')).toBeVisible()
  })
})
