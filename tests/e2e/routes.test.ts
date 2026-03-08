import { test, expect } from '@playwright/test'

async function loginAs(page: any, email: string, password: string) {
  await page.goto('/auth/login')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.screenshot({ path: 'test-results/screenshots/before-login.png' })
  await page.click('button[type="submit"]')
  await page.screenshot({ path: 'test-results/screenshots/after-login.png' })
  await page.waitForURL('/')
}

test('guest is redirected to login from home', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/auth/login')
})

test('guest is redirected to login from admin', async ({ page }) => {
  await page.goto('/admin/invite')
  await expect(page).toHaveURL('/auth/login')
})

test('logged in user is redirected away from login', async ({ page }) => {
  await loginAs(page, 'user@test.com', 'password123')
  await page.goto('/auth/login')
  await expect(page).toHaveURL('/')
})

test('non-admin is redirected from invite page', async ({ page }) => {
  await loginAs(page, 'user@test.com', 'password123')
  await page.goto('/admin/invite')
  await expect(page).toHaveURL('/')
})

test('admin can access invite page', async ({ page }) => {
  await loginAs(page, 'admin@test.com', 'password123')
  await page.goto('/admin/invite')
  await expect(page).toHaveURL('/admin/invite')
})