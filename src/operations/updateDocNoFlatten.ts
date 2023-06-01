import { OriDocumentReference, UpdateNoFlatten } from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValues'

/**
 * Updates fields in the document referred to by this `DocumentReference`.
 * The update will fail if applied to a document that does not exist.
 *
 * Nested fields can be updated by providing dot-separated field path
 * strings.
 *
 * @param data An object containing the fields and values with which to
 * update the document.
 * @param precondition A Precondition to enforce on this update.
 * @throws Error If the provided input is not valid Firestore data.
 * @return A Promise resolved with the write time of this update.
 */
export const updateDocNoFlatten: UpdateNoFlatten = (
	reference,
	data,
	precondition?
) => {
	const data_ = removeFieldValueInhomogeneousProps(data)

	return Object.keys(data_).length > 0
		? // @ts-expect-error
		  (reference as OriDocumentReference).update(data_, precondition || {})
		: Promise.resolve(undefined)
}
