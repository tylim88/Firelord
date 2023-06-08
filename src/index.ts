import {
	MetaType,
	Query,
	Firestore,
	Doc,
	GetOddOrEvenSegments,
	Collection,
} from './types'
import {
	docCreator as d,
	collectionCreator as c,
	collectionGroupCreator as cg,
} from './refs'

/**
 * Gets a FirelordReference instance that refers to the doc, collection, and collectionGroup at the specified absolute path.
 * @param firestore - A reference to the root `Firestore` instance.
 * @param collectionIDs - all the collectionID(s) needed to build this collection path.
 * @returns Creator function of DocumentReference, CollectionReference and CollectionGroupReference.
 */
export const getFirelord: GetFirelord = (firestore, ...collectionIDs) => {
	return {
		doc: d(
			firestore,
			// @ts-expect-error
			...collectionIDs
		),
		collection: c(
			firestore,
			// @ts-expect-error
			...collectionIDs
		),
		collectionGroup: cg(firestore, collectionIDs[collectionIDs.length - 1]!),
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
export * from './refs'
export * from './equal'
export type {
	MetaType,
	MetaTypeCreator,
	AbstractMetaTypeCreator,
	ServerTimestamp,
	Delete,
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
