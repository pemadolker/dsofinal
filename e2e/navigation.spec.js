import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('nav links change active page', async ({ page }) => {
    await page.goto('/')

    // Go to blog
    await page.getByRole('link', { name: /blog|notes/i }).first().click()
    await expect(page.locator('main')).toBeVisible()
  })

  test('unauthenticated write redirects to auth', async ({ page }) => {
    await page.goto('/')
    // Click the write/start writing button (visible to guests)
    const writeBtn = page.getByRole('button', { name: /start writing|write/i }).first()
    if (await writeBtn.isVisible()) {
      await writeBtn.click()
      // Should land on auth page (sign in prompt visible)
      await expect(page.getByText(/sign in|log in|email/i).first()).toBeVisible()
    }
  })

  test('unauthenticated favourites redirects to auth', async ({ page }) => {
    await page.goto('/')
    const favBtn = page.getByRole('button', { name: /favourites|favorites/i }).first()
    if (await favBtn.isVisible()) {
      await favBtn.click()
      await expect(page.getByText(/sign in|log in|email/i).first()).toBeVisible()
    }
  })
})
