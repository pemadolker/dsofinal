import { test, expect } from '@playwright/test'

/**
 * Security smoke tests — verify that essential HTTP security headers
 * and XSS protections are in place on the production deployment.
 */
test.describe('Security Headers', () => {
  let response

  test.beforeAll(async ({ request }) => {
    response = await request.get('/')
  })

  test('X-Frame-Options header prevents clickjacking', async ({ request }) => {
    const res = await request.get('/')
    const header = res.headers()['x-frame-options']
    expect(header).toBeTruthy()
    expect(header.toUpperCase()).toContain('SAMEORIGIN')
  })

  test('X-Content-Type-Options prevents MIME sniffing', async ({ request }) => {
    const res = await request.get('/')
    expect(res.headers()['x-content-type-options']).toBe('nosniff')
  })

  test('Referrer-Policy header is set', async ({ request }) => {
    const res = await request.get('/')
    expect(res.headers()['referrer-policy']).toBeTruthy()
  })

  test('Content-Security-Policy header is present', async ({ request }) => {
    const res = await request.get('/')
    expect(res.headers()['content-security-policy']).toBeTruthy()
  })

  test('app returns 200 on root', async ({ request }) => {
    const res = await request.get('/')
    expect(res.status()).toBe(200)
  })

  test('SPA fallback — unknown route returns 200 (not 404)', async ({ request }) => {
    const res = await request.get('/this-route-does-not-exist')
    // React SPA — nginx should serve index.html for all routes
    expect(res.status()).toBe(200)
  })
})

test.describe('XSS Prevention', () => {
  test('script injection in URL does not execute', async ({ page }) => {
    const alerts: string[] = []
    page.on('dialog', async (dialog) => {
      alerts.push(dialog.message())
      await dialog.dismiss()
    })

    await page.goto('/?q=<script>alert("xss")</script>')
    await page.waitForLoadState('networkidle')

    expect(alerts).toHaveLength(0)
  })
})
