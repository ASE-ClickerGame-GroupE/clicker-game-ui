import { test, expect } from '@playwright/test'

// This test uses network mocking so it does not require a real backend.
// It verifies the protected-route -> login -> return flow and the Login/Logout button visibility.

test('Protected -> Login -> Home flow with mocked /api/login and logout', async ({ page }) => {
  // Mock the /api/login endpoint to return a token
  await page.route('**/api/login', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'dev-token' }),
      })
    } else {
      await route.continue()
    }
  })

  // Start from a protected route (home). App should redirect to /login
  await page.goto('/')
  await expect(page).toHaveURL(/\/login/)

  // Fill login form and submit
  await page.getByLabel('Email').fill('user@example.com')
  await page.getByLabel('Password').fill('validpassword')
  await page.getByRole('button', { name: /sign in/i }).click()

  // After mocked login, app should navigate back to '/'
  await page.waitForURL('**/')
  await expect(page).toHaveURL('http://localhost:5173/')

  // Logout button should be visible (user is authenticated)
  await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()

  // Click logout and expect Login to re-appear without needing backend
  await page.getByRole('button', { name: /logout/i }).click()
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
})

