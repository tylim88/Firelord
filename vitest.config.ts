import { defineConfig } from 'vitest/config'

export const preset = {
	environment: 'node',
	coverage: { enabled: true },
	setupFiles: ['dotenv/config'],
	globals: true,
	include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
	exclude: ['src/emulator.test.ts'],
	watch: false,
}

export default defineConfig({
	test: { ...preset },
})
