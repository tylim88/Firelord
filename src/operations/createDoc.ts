import { OriDocumentReference, DocumentData, Create } from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

/**
 * Creates a document referred to by this `DocumentReference` with the
 * provided object values. The write fails if the document already exists
 *
 * @param data The object data to serialize as the document.
 * @throws Error If the provided input is not a valid Firestore document.
 * @return A Promise resolved with the write time of this create.
 */
export const createDoc = ((
	reference: OriDocumentReference,
	data: DocumentData
) => {
	return reference.create(removeFieldValueInhomogeneousProps(data))
}) as Create
