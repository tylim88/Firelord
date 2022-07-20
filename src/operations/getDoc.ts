import { Get, OriDocumentReference, DocumentSnapshot, MetaType } from '../types'
/**
Reads the document referred to by this DocumentReference.

@param reference — The reference of the document to fetch.

@returns A Promise resolved with a DocumentSnapshot containing the current document contents.
*/

export const getDoc = ((reference: OriDocumentReference) => {
	return reference.get() as Promise<DocumentSnapshot<MetaType>>
}) as Get
