import {
	MetaType,
	Query,
	Firestore,
	Doc,
	GetOddOrEvenSegments,
	Collection,
} from './types'
import { docCreator, collectionCreator, collectionGroupCreator } from './refs'

/**
 * Gets a FirelordReference instance that refers to the doc, collection, and collectionGroup at the specified absolute path.
 * @param firestore - A reference to the root `Firestore` instance.
 * @param collectionIDs - all the collectionID(s) needed to build this collection path.
 * @returns Creator function of DocumentReference, CollectionReference and CollectionGroupReference.
 */
export const getFirelord: GetFirelord = (firestore, ...collectionIDs) => {
	return {
		doc: docCreator(firestore, collectionIDs),
		collection: collectionCreator(firestore, collectionIDs),
		collectionGroup: collectionGroupCreator(
			firestore,
			collectionIDs[collectionIDs.length - 1]!
		),
	}
}
export type GetFirelord = {
	<T extends MetaType>(
		firestore: Firestore,
		...collectionIDs: GetOddOrEvenSegments<T['collectionPath']>
	): FirelordRef<T>
}

export type FirelordRef<T extends MetaType> = Readonly<{
	/**
	 * Gets a `DocumentReference` instance that refers to the document at the
	 * specified absolute path.
	 *
	 * @param documentIds - all the docID(s) needed to build this document path.
	 * @returns The `DocumentReference` instance.
	 */
	doc: Doc<T>
	/**
	 * Gets a `CollectionReference` instance that refers to the collection at
	 * the specified absolute path.
	 *
	 * @param documentIds - all the docID(s) needed to build this collection path.
	 * @returns The `CollectionReference` instance.
	 */
	collection: Collection<T>
	/**
	 * @returns — The created Query.
	 */
	collectionGroup: () => Query<T>
}>
export { getFirestore, Timestamp, GeoPoint } from 'firebase-admin/firestore'

export * from './batch'
export * from './transaction'
export * from './fieldValues'
export * from './operations'
export * from './queryConstraints'
export { query } from './refs'
export * from './equal'
export type {
	MetaType,
	MetaTypeCreator,
	ServerTimestamp,
	DeleteField,
	PossiblyReadAsUndefined,
	DocumentReference,
	CollectionReference,
	Query,
	DocumentSnapshot,
	QuerySnapshot,
	QueryDocumentSnapshot,
	WriteBatch,
	RunTransaction,
	GetDocIds,
	Transaction,
	GetCollectionIds,
} from './types'
