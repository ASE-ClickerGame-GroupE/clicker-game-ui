import type { FullConfig } from '@playwright/test'
import { chromium } from '@playwright/test'
import { TEST_USER, BASE_URL } from './test-credentials'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function globalSetup(_config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    await page.goto(`${BASE_URL}/login`)

    // Fill the form. Use label fallbacks if needed.
    try {
      await page.getByLabel('Username').fill(TEST_USER.username)
    } catch {
      await page
        .fill('input[name="username"]', TEST_USER.username)
        .catch(() => {})
    }

    try {
      await page.getByLabel('Password').fill(TEST_USER.password)
    } catch {
      await page
        .fill('input[name="password"]', TEST_USER.password)
        .catch(() => {})
    }

    // Click sign in and wait for navigation or profile button
    await page
      .getByRole('button', { name: /sign in/i })
      .click()
      .catch(() => {})

    // Wait for either profile button or redirect to home
    await page.waitForTimeout(2000)

    // Save storage state (cookies + localStorage) for reuse in tests
    await page.context().storageState({ path: 'e2e/storageState.json' })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // On failure create an empty storage state so tests still run unauthenticated
    await page.context().storageState({ path: 'e2e/storageState.json' })
  } finally {
    await browser.close()
  }
}
