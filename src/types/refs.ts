import { MetaType } from './metaTypeCreator'
import { Firestore } from './alias'

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
	listCollections(): Promise<Array<CollectionReference<T>>> // ! revisit and fix type
}

export interface CollectionReference<T extends MetaType> extends Query<T> {
	/** The collection's identifier. */
	readonly id: T['docID']
	/**
	 * A reference to the containing `DocumentReference` if this is a
	 * subcollection. If this isn't a subcollection, the reference is null.
	 */
	readonly parent: T['parent']
	/**
	 * A string representing the path of the referenced collection (relative
	 * to the root of the database).
	 */
	readonly path: T['docPath']
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
	listDocuments(): Promise<Array<DocumentReference<T>>> // ! revisit
}

export interface Query<T extends MetaType> {
	/**
	 * The `Firestore` for the Firestore database (useful for performing
	 * transactions, etc.).
	 */
	readonly firestore: Firestore
	/*
	 * Executes the query and returns the results as Node Stream.
	 *
	 * @return A stream of QueryDocumentSnapshot.
	 */
	stream(): NodeJS.ReadableStream // ! revisit
	/**
	 * Creates and returns a new Query instance that applies a field mask to
	 * the result and returns only the specified subset of fields. You can
	 * specify a list of field paths to return, or use an empty list to only
	 * return the references of matching documents.
	 *
	 * Queries that contain field masks cannot be listened to via `onSnapshot()`
	 * listeners.
	 *
	 * This function returns a new (immutable) instance of the Query (rather
	 * than modify the existing instance) to impose the field mask.
	 *
	 * @param field The field paths to return.
	 * @return The created Query.
	 */
	select(...field: (keyof T['writeFlatten'])[]): Query<T> // ! revisit
	/**
	 * Specifies the offset of the returned results.
	 *
	 * This function returns a new (immutable) instance of the Query (rather
	 * than modify the existing instance) to impose the offset.
	 *
	 * @param offset The offset to apply to the Query results.
	 * @return The created Query.
	 */
	offset(offset: number): Query<T> // ! revisit
}
