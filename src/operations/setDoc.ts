import { OriDocumentReference, Set } from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValues'

/**
 * Writes to the document referred to by this `DocumentReference`. If the
 * document does not yet exist, it will be created. If you pass
 * `SetOptions`, the provided data can be merged into an existing document.
 *
 * @param data A map of the fields and values for the document.
 * @param options An object to configure the set behavior.
 * @param  options.merge - If true, set() merges the values specified in its
 * data argument. Fields omitted from this set() call remain untouched.
 * @param options.mergeFields - If provided, set() only replaces the
 * specified field paths. Any field path that is not specified is ignored
 * and remains untouched.
 * @throws Error If the provided input is not a valid Firestore document.
 * @return A Promise resolved with the write time of this set.
 */
export const setDoc: Set = (reference, data, options?) => {
	// @ts-expect-error
	return (reference as OriDocumentReference).set(
		removeFieldValueInhomogeneousProps(data),
		options || {}
	)
}
