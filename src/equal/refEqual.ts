import {
	DocumentReference,
	CollectionReference,
	MetaType,
	OriCollectionReference,
} from '../types'
/**
 * Returns true if the provided references are equal.
 *
 * @param left - A reference to compare.
 * @param right - A reference to compare.
 * @returns true if the references point to the same location in the same
 * Firestore database.
 */
export const refEqual = <
	T extends DocumentReference<MetaType> | CollectionReference<MetaType>,
	U extends T
>(
	left: T,
	right: U
) => {
	return (left as OriCollectionReference).isEqual(
		right as OriCollectionReference
	)
}
