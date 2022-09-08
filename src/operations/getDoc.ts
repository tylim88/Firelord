import { GetDoc, OriDocumentReference } from '../types'

/**
 * Reads the document referred to by this `DocumentReference`.
 *
 * @return A Promise resolved with a DocumentSnapshot containing the
 * current document contents.
 */
// @ts-expect-error
export const getDoc: GetDoc = (reference: OriDocumentReference) => {
	return reference.get()
}
