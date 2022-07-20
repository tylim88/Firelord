import { DocumentId } from '../types'
import { FieldPath } from 'firebase-admin/firestore'

/**
 * Returns a special sentinel `FieldPath` to refer to the ID of a document.
 * It can be used in queries to sort or filter by the document ID.
 */
export const documentId = () => {
	return FieldPath.documentId() as unknown as DocumentId
}
