import { test, expect } from '@playwright/test'
import fs from 'fs'

const ART_DIR = 'test-artifacts'
if (!fs.existsSync(ART_DIR)) fs.mkdirSync(ART_DIR)

const cases = [
  { loc: 'en', addToCart: 'Add to Cart', proceedToCheckout: 'Proceed to Checkout', loginSignIn: 'Sign in', localeTag: 'en-US', currency: 'USD' },
  { loc: 'es', addToCart: 'Añadir al carrito', proceedToCheckout: 'Proceder al pago', loginSignIn: 'Iniciar sesión', localeTag: 'es-ES', currency: 'USD' },
  { loc: 'zh', addToCart: '加入购物车', proceedToCheckout: '前往结账', loginSignIn: '登录', localeTag: 'zh-CN', currency: 'CNY' },
  { loc: 'ja', addToCart: 'カートに入れる', proceedToCheckout: 'レジに進む', loginSignIn: 'サインイン', localeTag: 'ja-JP', currency: 'JPY' },
] as const

test.describe('Checkout flow (mock payment)', () => {
  for (const c of cases) {
    test(`Checkout end-to-end - ${c.loc}`, async ({ page }) => {
      // Set locale cookie
      await page.context().addCookies([{ name: 'NEXT_LOCALE', value: c.loc, url: 'http://localhost:3000' }])

      // Login
      await page.goto('http://localhost:3000/login')
      await page.locator('input[type="email"]').fill('test@example.com')
      await page.locator('input[type="password"]').fill('password123')
      await page.getByRole('button', { name: c.loginSignIn }).click()
      // Wait for token to be stored indicating login success
      await page.waitForFunction(() => window.localStorage.getItem('token') !== null)

      // Add product 1 to cart from PDP for determinism
      await page.goto('http://localhost:3000/products/1')
      await page.locator('[data-testid="pdp-add-to-cart"]').click()

      // Go to cart and proceed to checkout
      await page.goto('http://localhost:3000/cart')
      await page.getByTestId('proceed-to-checkout').click()

      // Shipping address
      await expect(page.locator('h1')).toContainText('Checkout')
      await page.locator('textarea').first().fill('123 Main St\nCity, Country')
      await page.getByTestId('continue-to-payment').click()

      // Payment (mock)
      await page.locator('input[placeholder="1234 5678 9012 3456"]').fill('4242 4242 4242 4242')
      await page.locator('input[placeholder="MM/YY"]').fill('12/28')
      await page.locator('input[placeholder="123"]').fill('123')
      await page.locator('input[placeholder="John Doe"]').fill('Test User')
      await page.locator('button[type="submit"]').click()

      // Confirmation page
      await expect(page).toHaveURL(/\/checkout\/confirmation\?orderId=\d+/)
      await expect(page.locator('h1')).toContainText('Payment Successful!')

      // Verify currency formatting for total using the same Intl formatting as app
      const expectedTotal = new Intl.NumberFormat(c.localeTag, { style: 'currency', currency: c.currency }).format(199.99)
      const summaryCard = page.getByTestId('order-summary')
      await expect(summaryCard).toContainText(expectedTotal)

      await page.screenshot({ path: `${ART_DIR}/checkout-confirmation-${c.loc}.png`, fullPage: true })
    })
  }
})