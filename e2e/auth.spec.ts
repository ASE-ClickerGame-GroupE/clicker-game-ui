import { test, expect } from '@playwright/test'

test.describe.skip('Auth form validation (e2e)', () => {
  test('Login form shows validation messages for bad input and hides them for valid input', async ({ page }) => {
    await page.goto('/login')

    // Fill invalid values
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Password').fill('123')
    await page.getByRole('button', { name: /sign in/i }).click()

    // Helper texts should be visible
    await expect(page.getByText('Enter a valid email')).toBeVisible()
    await expect(page.getByText('Password 6-24 characters')).toBeVisible()

    // Now fill valid values
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('validpassword')
    await page.getByRole('button', { name: /sign in/i }).click()

    // Validation messages should not be visible anymore
    await expect(page.getByText('Enter a valid email')).not.toBeVisible()
    await expect(page.getByText('Password 6-24 characters')).not.toBeVisible()
  })

  test('Register form shows validation for email/password/mismatch and clears for valid input', async ({ page }) => {
    await page.goto('/register')

    // Fill invalid values: bad email, short password, mismatch repeat
    await page.getByLabel('Email').fill('bad-email')
    await page.getByLabel('Password', { exact: true }).fill('123')
    await page.getByLabel('Repeat Password').fill('124')
    await page.getByRole('button', { name: /register/i }).click()

    await expect(page.getByText('Enter a valid email')).toBeVisible()
    await expect(page.getByText('Password 6-24 characters')).toBeVisible()
    await expect(page.getByText('Passwords must match')).toBeVisible()

    // Now fill valid values and matching repeat
    await page.getByLabel('Email').fill('newuser@example.com')
    await page.getByLabel('Password', { exact: true }).fill('validpass')
    await page.getByLabel('Repeat Password').fill('validpass')
    await page.getByRole('button', { name: /register/i }).click()

    // Validation messages should no longer be visible
    await expect(page.getByText('Enter a valid email')).not.toBeVisible()
    await expect(page.getByText('Password 6-24 characters')).not.toBeVisible()
    await expect(page.getByText('Passwords must match')).not.toBeVisible()
  })
})
