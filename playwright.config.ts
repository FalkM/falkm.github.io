import { defineConfig } from '@playwright/test'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve(process.cwd(), '.env.test'), override: true })

// Parse .env.test manually
const envTest = config({
	path: path.resolve(process.cwd(), '.env.test'),
	override: true
}).parsed ?? {}

export default defineConfig({
	testDir: './tests/e2e',
	outputDir: './test-results',
	use: {
		baseURL: 'http://localhost:3000',
	},
	webServer: {
		command: 'npx dotenv -e .env.test -- npm run dev',
		url: 'http://localhost:3000',
		reuseExistingServer: false,
		env: {
			...process.env as Record<string, string>,
		},
		stdout: 'pipe',
		stderr: 'pipe',
	},
})