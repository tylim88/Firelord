import type { MetaType } from '../metaTypeCreator'
import type { Firestore } from '../alias'
import type { GetOddOrEvenSegments } from '../utils'
import type { IsValidDocIDLoop } from '../validID'
import type { DocumentReference } from './doc'
import type { Query } from './query'
import type { DocumentSnapshot } from '../snapshot'
import type { GetDoc, GetDocs, OnSnapshot } from '../operations'

/**
 * A {@link CollectionReference} object can be used for adding documents, getting
 * document references, and querying for documents (using the methods
 * inherited from `Query`).
 */
export interface CollectionReference<T extends MetaType> extends Query<T> {
	/** The collection's identifier. */
	readonly id: T['collectionID']
	/**
	 * A reference to the containing {@link DocumentReference} if this is a
	 * sub-collection. If this isn't a sub-collection, the reference is null.
	 */
	readonly parent: T['parent'] extends MetaType
		? DocumentReference<T['parent']>
		: null
	/**
	 * A string representing the path of the referenced collection (relative
	 * to the root of the database).
	 */
	readonly path: T['collectionPath']
	/**
	 * Retrieves the list of documents in this collection.
	 *
	 * The {@link DocumentReference} returned may include references to "missing
	 * documents", i.e. document locations that have no document present but
	 * which contain sub-collections with documents. Attempting to read such a
	 * document reference (e.g. via {@link GetDoc}, {@link GetDocs} or {@link OnSnapshot}) will return a
	 * {@link DocumentSnapshot} whose `.exists` property is false.
	 *
	 * @return {Promise<DocumentReference[]>} The list of documents in this
	 * collection.
	 */
	listDocuments(): Promise<DocumentReference<T>[]> // ! revisit
}

export type CollectionCreator = {
	<T extends MetaType>(
		fStore: Firestore,
		...collectionIDs: GetOddOrEvenSegments<T['collectionPath'], 'Odd'>
	): Collection<T>
}

export type Collection<T extends MetaType> = {
	/**
	 * Gets a {@link CollectionReference} instance that refers to the collection at
	 * the specified absolute path.
	 *
	 *  related documentations:
	 *  - {@link https://firelordjs.com/guides/metatype child meta type}
	 *  - {@link https://firelordjs.com/firelord/quick_start#operations operation}
	 * @param documentIds
	 *  All the docID(s) needed to build this document path, eg
	 *  - for top-collection: example.collection()
	 *  - for sub-collection: example.collection(GrandParentDocId, ParentsDocId)
	 *
	 * @returns The {@link CollectionReference} instance.
	 */
	<D extends GetOddOrEvenSegments<T['collectionPath'], 'Even'>>(
		...documentIDs: D extends never ? D : IsValidDocIDLoop<D>
	): CollectionReference<T>
}

export type GetCollectionIds<T extends MetaType> = GetOddOrEvenSegments<
	T['collectionPath'],
	'Even'
>

/**
 * stop TS from tree shake the types, we need this type for JSDoc
 */
export type DummyCollection =
	| GetDoc
	| GetDocs
	| OnSnapshot
	| DocumentSnapshot<MetaType>
