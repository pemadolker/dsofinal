import { test, expect } from '@playwright/test'

test.describe('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /browse all notes/i }).click()
  })

  test('blog page renders without crashing', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible()
  })

  test('search input is present', async ({ page }) => {
    const search = page.getByRole('searchbox').or(
      page.getByPlaceholder(/search/i)
    )
    await expect(search.first()).toBeVisible()
  })

  test('post cards render (if posts exist)', async ({ page }) => {
    // Either posts or an empty state message should appear
    const hasCards  = await page.locator('[class*="card"], article').count()
    const hasEmpty  = await page.getByText(/no notes|nothing here|empty/i).count()
    expect(hasCards + hasEmpty).toBeGreaterThan(0)
  })

  test('clicking a post card opens the post', async ({ page }) => {
    const cards = page.locator('[class*="card"], article').filter({ hasText: /\w+/ })
    const count = await cards.count()
    if (count > 0) {
      await cards.first().click()
      // PostPage should show a back button
      await expect(page.getByRole('button', { name: /back/i })).toBeVisible()
    }
  })
})
