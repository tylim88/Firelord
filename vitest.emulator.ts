import { defineConfig } from 'vitest/config'
import { preset } from './vitest.config'

export default defineConfig({
	test: { ...preset, include: ['src/emulator.test.ts'], exclude: [] },
})
