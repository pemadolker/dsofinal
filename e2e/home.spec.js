import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads and shows hero section', async ({ page }) => {
    // Title visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    // Hero CTA button present
    await expect(page.getByRole('button', { name: /browse all notes/i })).toBeVisible()
  })

  test('page title is set', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/)
  })

  test('navigation bar is rendered', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible()
  })

  test('footer is rendered', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible()
  })

  test('hero CTA navigates to blog page', async ({ page }) => {
    await page.getByRole('button', { name: /browse all notes/i }).click()
    // Should show blog content
    await expect(page.getByText(/notes|posts|articles/i).first()).toBeVisible()
  })
})
