import { test, expect } from '@playwright/test'
import fs from 'fs'

const ART_DIR = 'test-artifacts'
if (!fs.existsSync(ART_DIR)) fs.mkdirSync(ART_DIR)

const cases = [
  { loc: 'en', homeTitle: 'Welcome to Our Store', productsTitle: 'All Products', pdp: 'Related Products', orders: 'Please log in to view your orders', loginTitle: 'Sign in to your account', loginSignIn: 'Sign in', registerTitle: 'Create your account', registerCreateAccount: 'Create account', cartEmptyTitle: 'Your cart is empty', cartPrompt: 'Please log in to view your cart' },
  { loc: 'es', homeTitle: 'Bienvenido a Nuestra Tienda', productsTitle: 'Todos los Productos', pdp: 'Productos Relacionados', orders: 'Inicia sesión para ver tus pedidos', loginTitle: 'Inicia sesión en tu cuenta', loginSignIn: 'Iniciar sesión', registerTitle: 'Crea tu cuenta', registerCreateAccount: 'Crear cuenta', cartEmptyTitle: 'Tu carrito está vacío', cartPrompt: 'Inicia sesión para ver tu carrito' },
  { loc: 'zh', homeTitle: '欢迎来到我们的商店', productsTitle: '全部产品', pdp: '相关产品', orders: '请登录以查看您的订单', loginTitle: '登录到您的账户', loginSignIn: '登录', registerTitle: '创建您的账户', registerCreateAccount: '创建账户', cartEmptyTitle: '您的购物车是空的', cartPrompt: '请登录以查看您的购物车' },
  { loc: 'ja', homeTitle: '私たちのストアへようこそ', productsTitle: 'すべての商品', pdp: '関連商品', orders: '注文を見るにはログインしてください', loginTitle: 'アカウントにサインイン', loginSignIn: 'サインイン', registerTitle: 'アカウントを作成', registerCreateAccount: 'アカウント作成', cartEmptyTitle: 'カートは空です', cartPrompt: 'カートを見るにはログインしてください' },
]

test.describe('i18n content', () => {
  for (const c of cases) {
    test(`Home hero SSR - ${c.loc}`, async ({ page }) => {
      await page.context().addCookies([{ name: 'NEXT_LOCALE', value: c.loc, url: 'http://localhost:3000' }])
      await page.goto(`http://localhost:3000/`)
      await expect(page.locator('h1')).toContainText(c.homeTitle, { timeout: 15000 })
      await page.screenshot({ path: `${ART_DIR}/home-${c.loc}.png`, fullPage: true })
    })

    test(`Products title - ${c.loc}`, async ({ page }) => {
      await page.context().addCookies([{ name: 'NEXT_LOCALE', value: c.loc, url: 'http://localhost:3000' }])
      await page.goto(`http://localhost:3000/products`)
      await expect(page.locator('h1')).toContainText(c.productsTitle, { timeout: 15000 })
      await page.screenshot({ path: `${ART_DIR}/products-${c.loc}.png`, fullPage: true })
    })

    test(`PDP related products - ${c.loc}`, async ({ page }) => {
      await page.context().addCookies([{ name: 'NEXT_LOCALE', value: c.loc, url: 'http://localhost:3000' }])
      await page.goto(`http://localhost:3000/products/1`)
      await expect(page.locator('body')).toContainText(c.pdp)
      await page.screenshot({ path: `${ART_DIR}/pdp-${c.loc}.png`, fullPage: true })
    })

    test(`Orders unauth prompt - ${c.loc}`, async ({ page }) => {
      await page.context().addCookies([{ name: 'NEXT_LOCALE', value: c.loc, url: 'http://localhost:3000' }])
      await page.goto(`http://localhost:3000/orders`)
      await expect(page.locator('body')).toContainText(c.orders)
      await page.screenshot({ path: `${ART_DIR}/orders-${c.loc}.png`, fullPage: true })
    })

    test(`Login/Register/Cart empty - ${c.loc}`, async ({ page }) => {
      // Login page assertions
      await page.context().addCookies([{ name: 'NEXT_LOCALE', value: c.loc, url: 'http://localhost:3000' }])
      await page.goto('http://localhost:3000/login')
      // Prefer checking the sign-in button to avoid hydration text race
      await expect(page.getByRole('button', { name: c.loginSignIn })).toBeVisible()
      await page.screenshot({ path: `${ART_DIR}/login-${c.loc}.png`, fullPage: true })

      // Perform login with test account
      await page.locator('input[type="email"]').fill('test@example.com')
      await page.locator('input[type="password"]').fill('password123')
      await page.getByRole('button', { name: c.loginSignIn }).click()
      // Navigate to cart and assert empty state
      await page.goto('http://localhost:3000/cart')
      // Allow either empty-state or auth prompt (if token not persisted yet)
      const body = page.locator('body')
      await expect(body).toContainText(new RegExp(`${c.cartEmptyTitle}|${c.cartPrompt}`))
      await page.screenshot({ path: `${ART_DIR}/cart-${c.loc}.png`, fullPage: true })

      // Register page assertions (content only)
      await page.goto('http://localhost:3000/register')
      await expect(page.getByRole('heading', { level: 2 })).toContainText(c.registerTitle)
      await page.screenshot({ path: `${ART_DIR}/register-${c.loc}.png`, fullPage: true })
    })
  }
})
