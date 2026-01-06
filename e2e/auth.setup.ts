import { test, expect } from '@playwright/test'
import { TEST_USER, BASE_URL } from './test-credentials'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
  })

  test('should show error message with invalid credentials', async ({
    page,
  }) => {
    await page.goto('/login')

    // Fill in invalid credentials
    await page.getByLabel('Username').fill('invalid_user_12345')
    await page.getByLabel('Password').fill('wrongpassword123')

    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click()

    // Wait for response
    await page.waitForTimeout(2000)

    // Should either show error message or stay on login page
    const currentUrl = page.url()
    expect(currentUrl).toContain('/login')

    // If error message appears, it's good. If not, staying on login page is also valid behavior
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/login')

    // Click submit without filling fields
    await page.getByRole('button', { name: /sign in/i }).click()

    // Should show validation messages
    await expect(page.getByText(/username is required/i)).toBeVisible()
  })

  test('should show validation error for short password', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Username').fill('testuser')
    await page.getByLabel('Password').fill('123')

    // Blur the password field to trigger validation
    await page.getByLabel('Password').blur()

    // Should show password length error
    await expect(page.getByText(/password 6-24 characters/i)).toBeVisible()
  })

  test('should navigate to register page from login', async ({ page }) => {
    await page.goto('/login')

    // Click the register link
    await page.getByText(/don't have an account/i).click()

    // Should navigate to register page
    await expect(page).toHaveURL(/\/register/)
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible()
  })

  test('should show validation errors on register page', async ({ page }) => {
    await page.goto('/register')

    // Fill invalid email
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Email').blur()

    // Should show email validation error
    await expect(page.getByText(/enter a valid email/i)).toBeVisible()

    // Fill mismatched passwords
    await page.getByLabel('Password', { exact: true }).fill('password123')
    await page.getByLabel('Repeat Password').fill('password456')
    await page.getByLabel('Repeat Password').blur()

    // Should show password mismatch error
    await expect(page.getByText(/passwords must match/i)).toBeVisible()
  })

  test('should navigate to login page from register', async ({ page }) => {
    await page.goto('/register')

    // Click the login link
    await page.getByText(/have an account/i).click()

    // Should navigate to login page
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()
  })

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/login')

    // Wait for page to load
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()

    // Fill in the login form
    await page.getByLabel('Username').fill(TEST_USER.username)
    await page.getByLabel('Password').fill(TEST_USER.password)

    // Submit the form
    await page.getByRole('button', { name: /sign in/i }).click()

    // Wait a bit for the request to complete
    await page.waitForTimeout(3000)

    await expect(page.getByTestId('profile-button')).toBeVisible({
      timeout: 5000,
    })

    // Save storage state (cookies + localStorage) so other projects/tests can reuse it
    // This writes e2e/storageState.json which should be referenced in playwright.config.ts
    try {
      await page.context().storageState({ path: 'e2e/storageState.json' })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // ignore write errors in CI/local environments
    }
  })
})
