import { Delete, OriDocumentReference, OriPrecondition } from '../types'

/**
 * Deletes the document referred to by this `DocumentReference`.
 *
 * @param precondition A Precondition to enforce for this delete.
 * @return A Promise resolved with the write time of this delete.
 */
export const deleteDoc = ((
	reference: OriDocumentReference,
	precondition?: OriPrecondition
) => {
	return reference.delete(precondition || {})
}) as Delete
