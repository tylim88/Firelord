import { defineConfig } from 'vitest/config'
import { preset } from '../vitest.config'

export default defineConfig({
	test: { ...preset, exclude: ['src/emulator.test.ts'] },
})
