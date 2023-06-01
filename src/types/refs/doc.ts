import { CollectionReference } from './collection'
import { MetaType } from '../metaTypeCreator'
import { Firestore } from '../alias'
import { GetOddOrEvenSegments } from '../utils'
import { IsValidDocIDLoop } from '../validID'
import { ErrorAutoIdTypeMustBeWideString } from '../error'

/**
 * A `DocumentReference` refers to a document location in a Firestore database
 * and can be used to write, read, or listen to the location. The document at
 * the referenced location may or may not exist. A `DocumentReference` can
 * also be used to create a `CollectionReference` to a subcollection.
 */
export interface DocumentReference<T extends MetaType> {
	/**
	 * The document's identifier within its collection.
	 */
	readonly id: T['docID']
	/**
	 * The `Firestore` instance the document is in.
	 * This is useful for performing transactions, for example.
	 */
	readonly firestore: Firestore
	/**
	 * The collection this `DocumentReference` belongs to.
	 */
	readonly parent: CollectionReference<T>
	/**
	 * A string representing the path of the referenced document (relative
	 * to the root of the database).
	 */
	readonly path: T['docPath']

	/**
	 * Fetches the subcollections that are direct children of this document.
	 *
	 * @returns A Promise that resolves with an array of CollectionReferences.
	 */
	listCollections(): Promise<CollectionReference<any>[]> // ! revisit and fix type
}

export type DocCreator = <T extends MetaType>(
	fStore: Firestore,
	collectionIDs: string[]
) => Doc<T>

export type Doc<T extends MetaType> = {
	<D extends GetOddOrEvenSegments<T['docPath'], false>>(
		...documentIDs: D extends never ? D : IsValidDocIDLoop<D>
	): DocumentReference<T>
	(
		CollectionReference: string extends T['docID']
			? CollectionReference<T>
			: ErrorAutoIdTypeMustBeWideString<T['docID']>
	): DocumentReference<T>
}

export type GetDocIds<T extends MetaType> = GetOddOrEvenSegments<
	T['docPath'],
	false
>