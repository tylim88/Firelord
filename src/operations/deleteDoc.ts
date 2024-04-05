import { DeleteDoc, OriDocumentReference } from '../types'

/**
 * Deletes the document referred to by this `DocumentReference`.
 *
 * @param precondition A Precondition to enforce for this delete.
 * @return A Promise resolved with the write time of this delete.
 */
export const deleteDoc: DeleteDoc = (reference, precondition) => {
	return (
		// @ts-expect-error
		(reference as OriDocumentReference)
			//
			.delete(precondition || {})
	)
}
