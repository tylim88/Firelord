import { SnapshotEqual } from '../types'

/**
 * Returns true if the provided snapshots are equal.
 *
 * @param left - A snapshot to compare.
 * @param right - A snapshot to compare.
 * @returns true if the snapshots are equal.
 */
export const snapshotEqual: SnapshotEqual = (left, right) => {
	// @ts-expect-error
	return left.isEqual(right)
}
