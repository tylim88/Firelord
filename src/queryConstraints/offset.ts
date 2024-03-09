import { Offset } from '../types'

/**
 * Specifies the offset of the returned results.
 *
 * This function returns a new (immutable) instance of the Query (rather
 * than modify the existing instance) to impose the offset.
 *
 * @param offset The offset to apply to the Query results.
 * @returns A {@link QueryConstraint} to pass to `query()`
 */
// @ts-expect-error
export const offset: Offset = offset => {
	return {
		type: 'offset',
		value: offset,
	}
}
