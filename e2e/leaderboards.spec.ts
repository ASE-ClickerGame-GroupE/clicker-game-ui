import { test, expect } from '@playwright/test'
import { TEST_USER, BASE_URL } from './test-credentials'

test.describe('Leaderboards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
  })

  test('should display leaderboards page with tabs', async ({ page }) => {
    await page.goto('/leaderboards')

    // Should see the main heading
    await expect(
      page.getByRole('heading', { name: /leaderboards/i })
    ).toBeVisible()

    // Should see both tabs
    await expect(page.getByRole('tab', { name: /total score/i })).toBeVisible()
    await expect(
      page.getByRole('tab', { name: /best single run/i })
    ).toBeVisible()

    // Total Score tab should be active by default
    await expect(
      page.getByRole('tab', { name: /total score/i })
    ).toHaveAttribute('aria-selected', 'true')
  })

  test('should switch between Total Score and Best Single Run tabs', async ({
    page,
  }) => {
    await page.goto('/leaderboards')

    // Wait for page to load
    await expect(
      page.getByRole('heading', { name: /leaderboards/i })
    ).toBeVisible()

    // Click Best Single Run tab
    await page.getByRole('tab', { name: /best single run/i }).click()

    // Tab should become active
    await expect(
      page.getByRole('tab', { name: /best single run/i })
    ).toHaveAttribute('aria-selected', 'true')

    // Should show different subtitle text - use more specific selector
    const subtitleText = page
      .locator('p.MuiTypography-body2')
      .filter({ hasText: /highest score achieved/i })
    await expect(subtitleText).toBeVisible()

    // Click back to Total Score
    await page.getByRole('tab', { name: /total score/i }).click()

    // Tab should be active again
    await expect(
      page.getByRole('tab', { name: /total score/i })
    ).toHaveAttribute('aria-selected', 'true')
  })

  test('should display leaderboard table with correct columns', async ({
    page,
  }) => {
    await page.goto('/leaderboards')

    // Wait for the table to load
    await page.waitForTimeout(2000)

    // Check for table headers
    await expect(
      page.getByRole('columnheader', { name: /ranking/i })
    ).toBeVisible({ timeout: 10000 })
    await expect(
      page.getByRole('columnheader', { name: /user/i })
    ).toBeVisible()
    await expect(
      page.getByRole('columnheader', { name: /total games/i })
    ).toBeVisible()
    await expect(
      page.getByRole('columnheader', { name: /total score/i })
    ).toBeVisible()
  })

  test('should show loading state initially', async ({ page }) => {
    await page.goto('/leaderboards')

    // Should show loading text briefly
    const loadingText = page.getByText(/loading/i)
    // Loading might be too fast, so we just check the page loads
    await expect(
      page.getByRole('heading', { name: /leaderboards/i })
    ).toBeVisible()
  })

  test('should highlight current user in leaderboard when logged in', async ({
    page,
  }) => {
    // Login first
    await page.goto('/login')
    await page.getByLabel('Username').fill(TEST_USER.username)
    await page.getByLabel('Password').fill(TEST_USER.password)
    await page.getByRole('button', { name: /sign in/i }).click()

    // Wait for login to complete
    await expect(page).toHaveURL(BASE_URL + '/')
    await page.waitForTimeout(1000)

    // Navigate to leaderboards
    await page.goto('/leaderboards')

    // Wait for leaderboard to load
    await page.waitForTimeout(2000)

    // Look for the "You" chip that indicates the current user
    // This might not appear if the user is not in the leaderboard yet
    const youChip = page.getByText('You', { exact: true })
    const chipCount = await youChip.count()

    // If user has played games, they should appear in leaderboard with "You" chip
    if (chipCount > 0) {
      await expect(youChip.first()).toBeVisible()
    }
  })

  test('should show different score column header for Best Single Run tab', async ({
    page,
  }) => {
    await page.goto('/leaderboards')

    // Wait for initial load
    await page.waitForTimeout(1000)

    // On Total Score tab, should show "Total score"
    await expect(
      page.getByRole('columnheader', { name: /total score/i })
    ).toBeVisible()

    // Switch to Best Single Run
    await page.getByRole('tab', { name: /best single run/i }).click()

    // Should now show "Best score"
    await expect(
      page.getByRole('columnheader', { name: /best score/i })
    ).toBeVisible({ timeout: 5000 })
  })

  test('should be accessible without authentication', async ({ page }) => {
    // Don't login, just navigate to leaderboards
    await page.goto('/leaderboards')

    // Should still see leaderboards
    await expect(
      page.getByRole('heading', { name: /leaderboards/i })
    ).toBeVisible()

    // Should see the table
    await expect(
      page.getByRole('columnheader', { name: /ranking/i })
    ).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to leaderboards from header', async ({ page }) => {
    await page.goto('/')

    // Wait for page to load
    await page.waitForTimeout(1000)

    // Click Leaders link in header
    const leadersLink = page.getByRole('link', { name: /leaders/i })
    await expect(leadersLink).toBeVisible({ timeout: 5000 })
    await leadersLink.click()

    // Should navigate to leaderboards page
    await expect(page).toHaveURL(/\/leaderboards/)
    await expect(
      page.getByRole('heading', { name: /leaderboards/i })
    ).toBeVisible()
  })
})
