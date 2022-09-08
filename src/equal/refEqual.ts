import { OriCollectionReference, RefEqual } from '../types'
/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
export const refEqual: RefEqual = (left, right) => {
	return (left as OriCollectionReference).isEqual(
		// @ts-expect-error
		right
	)
}
