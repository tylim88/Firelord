import { CollectionReference } from './collection'
import { MetaType } from '../metaTypeCreator'
import { Firestore } from '../alias'
import { GetOddOrEvenSegments } from '../utils'
import { IsValidDocIDLoop } from '../validID'
import {
	ErrorAutoIdTypeMustBeWideString,
	ErrorDocIdIncorrectType,
} from '../error'

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
	...collectionIDs: GetOddOrEvenSegments<T['collectionPath'], 'Odd'>
) => Doc<T>

export type Doc<T extends MetaType> = {
	/**
	 * Gets a `DocumentReference` instance that refers to the document at the
	 * specified absolute path.
	 *
	 * @param documentIds_or_CollectionReference
	 * Option 1: all the docID(s) needed to build this document path, eg
	 *  - for top-collection: example.doc(SelfDocId)
	 *  - for sub-collection: example.doc(GrandParentDocId, ParentsDocId, SelfDocId).
	 *
	 * Option 2: CollectionReference (to create auto id doc ref), eg
	 *  - for top-collection: example.doc(example.collection())
	 *  - for sub-collection: example.doc(example.collection(GrandParentCollectionID, ParenCollectionID))
	 *
	 *  related documentations:
	 *  - {@link https://firelordjs.com/guides/metatype child meta type}
	 *  - {@link https://firelordjs.com/quick_start#operations operation}
	 * @returns The `DocumentReference` instance.
	 */
	<
		D extends
			| IsValidDocIDLoop<GetOddOrEvenSegments<T['docPath'], 'Even'>>
			| CollectionReference<T>
	>(
		...documentIds_or_CollectionReference: D extends never
			? D
			: D extends CollectionReference<T>
			? string extends T['docID']
				? [D]
				: [ErrorAutoIdTypeMustBeWideString<T['docID']>]
			: D extends string[]
			? IsValidDocIDLoop<D>
			: ErrorDocIdIncorrectType
	): DocumentReference<T>
}

export type GetDocIds<T extends MetaType> = GetOddOrEvenSegments<
	T['docPath'],
	'Even'
>
