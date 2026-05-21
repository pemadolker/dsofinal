import { test, expect } from '@playwright/test'

test.describe('Auth Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Navigate to auth via sign in button or write redirect
    const signInBtn = page.getByRole('button', { name: /sign in|log in|join/i }).first()
    if (await signInBtn.isVisible()) {
      await signInBtn.click()
    }
  })

  test('auth form renders email & password fields', async ({ page }) => {
    await expect(page.getByLabel(/email/i).or(
      page.getByPlaceholder(/email/i)
    ).first()).toBeVisible()

    await expect(page.getByLabel(/password/i).or(
      page.getByPlaceholder(/password/i)
    ).first()).toBeVisible()
  })

  test('empty form submit shows validation feedback', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /sign in|log in/i }).first()
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      // Either HTML5 validation or an error message
      const invalid = await page.evaluate(() =>
        [...document.querySelectorAll('input')].some(i => !i.validity.valid)
      )
      const errorMsg = await page.getByText(/required|invalid|error/i).count()
      expect(invalid || errorMsg > 0).toBeTruthy()
    }
  })

  test('Google OAuth button is present', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /google/i })
    ).toBeVisible()
  })
})

// ── Authenticated flow (only runs when test credentials are set) ──
test.describe('Authenticated Write Flow', () => {
  test.skip(
    !process.env.TEST_USER_EMAIL,
    'Skipped — set TEST_USER_EMAIL + TEST_USER_PASSWORD secrets to enable'
  )

  test('can sign in with email and publish a post', async ({ page }) => {
    await page.goto('/')

    // Navigate to auth
    await page.getByRole('button', { name: /sign in|log in|join/i }).first().click()

    // Fill credentials
    await page.getByPlaceholder(/email/i).fill(process.env.TEST_USER_EMAIL)
    await page.getByPlaceholder(/password/i).fill(process.env.TEST_USER_PASSWORD)
    await page.getByRole('button', { name: /sign in/i }).click()

    // Wait for redirect back to home/blog
    await expect(page.locator('nav')).toBeVisible({ timeout: 10_000 })

    // Navigate to write
    await page.getByRole('button', { name: /write/i }).click()

    // Fill the post form
    await page.getByPlaceholder(/title/i).fill('E2E test post')
    const body = page.getByRole('textbox').last()
    await body.fill('This is an automated E2E test post. Safe to delete.')

    // Publish
    await page.getByRole('button', { name: /publish|save/i }).click()

    // Toast confirmation
    await expect(page.getByText(/published|saved|note/i)).toBeVisible({ timeout: 8_000 })
  })
})
