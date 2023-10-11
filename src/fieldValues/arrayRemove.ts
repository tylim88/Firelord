import { FieldValue } from 'firebase-admin/firestore'
import { ArrayRemoveOrUnionFunction } from '../types'

/**
 * Returns a special value that can be used with set(), create() or update()
 * that tells the server to remove the given elements from any array value
 * that already exists on the server. All instances of each element
 * specified will be removed from the array. If the field being modified is
 * not already an array it will be overwritten with an empty array.
 *
 * @param elements The elements to remove from the array.
 * @return The FieldValue sentinel for use in a call to set(), create() or
 * update().
 */
// @ts-expect-error
export const arrayRemove: ArrayRemoveOrUnionFunction = (...elements) => {
	// * web doesn't have empty array issue
	const filler = elements.length === 0 ? [[]] : elements
	const ref = FieldValue.arrayRemove(...filler)
	// @ts-expect-error
	ref.Firelord_ArrayFieldValue = elements

	return ref
}
