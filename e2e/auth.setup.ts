import { test, expect } from '@playwright/test'
import { TEST_USER } from './test-credentials'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Username').fill('invalid_user_12345')
    await page.getByLabel('Password').fill('wrongpassword123')
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 })
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByText(/username is required/i)).toBeVisible()
  })

  test('should show validation error for short password', async ({ page }) => {
    await page.goto('/login')

    await page.getByLabel('Username').fill('testuser')
    await page.getByLabel('Password').fill('123')
    await page.getByLabel('Password').blur()

    await expect(page.getByText(/password 6-24 characters/i)).toBeVisible()
  })

  test('should navigate to register page from login', async ({ page }) => {
    await page.goto('/login')
    await page.getByText(/don't have an account/i).click()
    await expect(page).toHaveURL(/\/register/)
    await expect(page.getByRole('heading', { name: /register/i })).toBeVisible()
  })

  test('should show validation errors on register page', async ({ page }) => {
    await page.goto('/register')

    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Email').blur()
    await expect(page.getByText(/enter a valid email/i)).toBeVisible()

    await page.getByLabel('Password', { exact: true }).fill('password123')
    await page.getByLabel('Repeat Password').fill('password456')
    await page.getByLabel('Repeat Password').blur()
    await expect(page.getByText(/passwords must match/i)).toBeVisible()
  })

  test('should navigate to login page from register', async ({ page }) => {
    await page.goto('/register')
    await page.getByText(/have an account/i).click()
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()
  })

  test('should successfully login with valid credentials', async ({ page, context }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()

    await page.getByLabel('Username').fill(TEST_USER.username)
    await page.getByLabel('Password').fill(TEST_USER.password)

    // Login request'i bekleyelim (endpoint adını bilmiyorsak networkidle da olur)
    await Promise.all([
      page.getByRole('button', { name: /sign in/i }).click(),
      page.waitForLoadState('networkidle'),
    ])

    // 1) Login sayfasından çıkmış mı?
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 })

    // 2) Token cookie var mı? (asıl kritik doğrulama)
    const cookies = await context.cookies()
    const tokenCookie = cookies.find((c) => c.name === 'token')
    expect(tokenCookie?.value).toBeTruthy()

    // İstersen UI'da "Logout" / username gibi bir şey de kontrol edebilirsin
    // await expect(page.getByText(/logout/i)).toBeVisible({ timeout: 15_000 })

    await context.storageState({ path: 'e2e/storageState.json' })
  })
})
