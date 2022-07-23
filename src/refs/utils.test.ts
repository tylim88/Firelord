import { handleEmptyArray } from './utils'
describe('test handleEmptyArray', () => {
	it('test empty data', () => {
		expect(handleEmptyArray([], 1, () => 2)).toBe(1)
	})
	it('test empty data', () => {
		expect(handleEmptyArray([1, 2, 3], 1, () => 2)).toBe(2)
	})
})
