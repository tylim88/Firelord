import { MetaType } from '../metaTypeCreator'
import { Firestore } from '../alias'
import { GetOddOrEvenSegments } from '../utils'
import { IsValidDocIDLoop } from '../validID'
import { DocumentReference } from './doc'
import { Query } from './query'

/**
 * A `CollectionReference` object can be used for adding documents, getting
 * document references, and querying for documents (using the methods
 * inherited from `Query`).
 */
export interface CollectionReference<T extends MetaType> extends Query<T> {
	/** The collection's identifier. */
	readonly id: T['collectionID']
	/**
	 * A reference to the containing `DocumentReference` if this is a
	 * subcollection. If this isn't a subcollection, the reference is null.
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
	 * The document references returned may include references to "missing
	 * documents", i.e. document locations that have no document present but
	 * which contain subcollections with documents. Attempting to read such a
	 * document reference (e.g. via `.get()` or `.onSnapshot()`) will return a
	 * `DocumentSnapshot` whose `.exists` property is false.
	 *
	 * @return {Promise<DocumentReference[]>} The list of documents in this
	 * collection.
	 */
	listDocuments(): Promise<DocumentReference<T>[]> // ! revisit
}

export type CollectionCreator = {
	/**
	 * Gets a `CollectionReference` instance that refers to the collection at
	 * the specified absolute path.
	 *
	 * @param documentIds - all the docID(s) needed to build this collection path.
	 * @returns The `CollectionReference` instance.
	 */
	<T extends MetaType>(
		fStore: Firestore,
		...collectionIDs: GetOddOrEvenSegments<T['collectionPath'], true>
	): Collection<T>
}

export type Collection<T extends MetaType> = <
	D extends GetOddOrEvenSegments<T['collectionPath'], false>
>(
	...documentIDs: D extends never ? D : IsValidDocIDLoop<D>
) => CollectionReference<T>

export type GetCollectionIds<T extends MetaType> = GetOddOrEvenSegments<
	T['collectionPath'],
	false
>
