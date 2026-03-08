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

async function getInviteLink(email: string, MAILPIT_URL: string): Promise<string> {

	const res = await fetch(`${MAILPIT_URL}/api/v1/messages`)
	expect(res.status).toBe(200)
	const data = await res.json()

	// Find latest message for our email
	const message = data.messages?.find((m: any) =>
		m.To?.some((t: any) => t.Address === email)
	)
	expect(message).toBeTruthy()

	// Get full message
	const msgRes = await fetch(`${MAILPIT_URL}/api/v1/message/${message.ID}`)
	const msg = await msgRes.json()

	// Extract link from plain text body
	const match = msg.Text.match(/https?:\/\/[^\s)]+verify[^\s)]+/)
	expect(match).not.toBeNull()

	return match![0]
}

function urlMatch(path: string) {
  const escapedPath = path === '/' ? '\\/$' : path.replace(/\//g, '\\/') + '$'
  return new RegExp(`(localhost|127\\.0\\.0\\.1):3000${escapedPath}`)
}

test('invite flow - user sets password and logs in', async ({ page }) => {
	const MAILPIT_URL = 'http://127.0.0.1:54324'
	page.on('console', msg => console.log('BROWSER:', msg.type(), msg.text()))

	// Step 1: Admin sends invite
	await loginAs(page, 'admin@test.com', 'password123')
	await page.goto('/admin/invite')
	await page.fill('input[type="email"]', 'newuser@test.com')
	await page.click('button:has-text("Send Invite")')
	await expect(page.locator('text=newuser@test.com')).toBeVisible({ timeout: 5000 })

	// Step 2: Admin signs out
	await page.click('button:has-text("Sign out")', { force: true })
	await expect(page).toHaveURL(urlMatch('/auth/login'))

	// Step 3: Get invite link from Mailpit
	const inviteLink = await getInviteLink('newuser@test.com', MAILPIT_URL)

	// Step 4: New user clicks invite link
	await page.goto(inviteLink)
	await expect(page).toHaveURL(/auth\/set-password/)

	// Step 5: User sets password
	await page.fill('input[placeholder="Password"]', 'newpassword123')
	await page.fill('input[placeholder="Confirm password"]', 'newpassword123')
	await page.click('button:has-text("Set Password")')
	await expect(page).toHaveURL(urlMatch('/'))

	// Step 6: Sign out and verify normal login works
	await page.click('button:has-text("Sign out")', { force: true })
	await loginAs(page, 'newuser@test.com', 'newpassword123')
	await expect(page).toHaveURL(urlMatch('/'))
})
