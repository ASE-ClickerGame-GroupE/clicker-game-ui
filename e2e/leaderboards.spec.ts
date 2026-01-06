import { test, expect } from '@playwright/test'
import { TEST_USER } from './test-credentials'

test.describe('Leaderboards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display leaderboards page with tabs', async ({ page }) => {
    await page.goto('/leaderboards')

    await expect(
      page.getByRole('heading', { name: /leaderboards/i })
    ).toBeVisible()

    await expect(page.getByRole('tab', { name: /total score/i })).toBeVisible()
    await expect(
      page.getByRole('tab', { name: /best single run/i })
    ).toBeVisible()

    await expect(page.getByRole('tab', { name: /total score/i })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  test('should switch between Total Score and Best Single Run tabs', async ({
                                                                              page,
                                                                            }) => {
    await page.goto('/leaderboards')
    await expect(
      page.getByRole('heading', { name: /leaderboards/i })
    ).toBeVisible()

    await page.getByRole('tab', { name: /best single run/i }).click()
    await expect(
      page.getByRole('tab', { name: /best single run/i })
    ).toHaveAttribute('aria-selected', 'true')

    await expect(page.getByText(/highest score achieved/i)).toBeVisible()

    await page.getByRole('tab', { name: /total score/i }).click()
    await expect(page.getByRole('tab', { name: /total score/i })).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  test('should display leaderboard table headers (Total Score tab)', async ({
                                                                              page,
                                                                            }) => {
    await page.goto('/leaderboards')
    await page.waitForLoadState('networkidle')

    await expect(
      page.getByRole('columnheader', { name: /^Ranking$/i })
    ).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByRole('columnheader', { name: /^User$/i })
    ).toBeVisible()
    await expect(
      page.getByRole('columnheader', { name: /^Total games$/i })
    ).toBeVisible()


    await expect(
      page.getByRole('columnheader', { name: /^Total score$/i })
    ).toBeVisible()
  })

  test('should show different score header in Best Single Run tab', async ({
                                                                             page,
                                                                           }) => {
    await page.goto('/leaderboards')
    await page.waitForLoadState('networkidle')


    await expect(
      page.getByRole('columnheader', { name: /^Total score$/i })
    ).toBeVisible({ timeout: 10_000 })

    await page.getByRole('tab', { name: /best single run/i }).click()
    await page.waitForLoadState('networkidle')


    await expect(
      page.getByRole('columnheader', { name: /^Best score$/i })
    ).toBeVisible({ timeout: 10_000 })
  })

  test('should be accessible without authentication', async ({ page }) => {
    await page.goto('/leaderboards')

    await expect(
      page.getByRole('heading', { name: /leaderboards/i })
    ).toBeVisible()
    await page.waitForLoadState('networkidle')


    await expect(
      page.getByRole('columnheader', { name: /^Ranking$/i })
    ).toBeVisible({ timeout: 10_000 })
  })

  test('should navigate to leaderboards from header', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: /leaders/i })).toBeVisible({
      timeout: 10_000,
    })
    await page.getByRole('link', { name: /leaders/i }).click()

    await expect(page).toHaveURL(/\/leaderboards/)
    await expect(
      page.getByRole('heading', { name: /leaderboards/i })
    ).toBeVisible()
  })

  test('should highlight current user when logged in (if present in leaderboard)', async ({
                                                                                            page,
                                                                                          }) => {
    await page.goto('/login')
    await page.getByLabel('Username').fill(TEST_USER.username)
    await page.getByLabel('Password').fill(TEST_USER.password)
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page.getByTestId('profile-button')).toBeVisible({
      timeout: 15_000,
    })

    await page.goto('/leaderboards')
    await page.waitForLoadState('networkidle')

    const youChip = page.getByText(/^You$/)
    if ((await youChip.count()) > 0) {
      await expect(youChip.first()).toBeVisible()
    }
  })
})
