import { OriCollectionReference, AddDoc } from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

/**
 * Add a new document to this collection with the specified data, assigning
 * it a document ID automatically.
 *
 * @param data An Object containing the data for the new document.
 * @throws Error If the provided input is not a valid Firestore document.
 * @return A Promise resolved with a `DocumentReference` pointing to the
 * newly created document after it has been written to the backend.
 */
// @ts-expect-error
export const addDoc: AddDoc = (reference, data) => {
	return (reference as OriCollectionReference).add(
		removeFieldValueInhomogeneousProps(data)
	)
}
