import { GetFirelordShakable } from './types'
import { docCreator, collectionCreator, collectionGroupCreator } from './refs'

export const getFirelordShakable: GetFirelordShakable =
	({ docCreator, collectionCreator, collectionGroupCreator }) =>
	// @ts-expect-error
	(firestore, ...collectionIDs) => {
		return {
			...(docCreator && {
				doc: docCreator(firestore, ...collectionIDs),
			}),
			...(collectionCreator && {
				collection: collectionCreator(firestore, ...collectionIDs),
			}),
			...(collectionGroupCreator && {
				collectionGroup: collectionGroupCreator(
					firestore,
					collectionIDs[collectionIDs.length - 1]!
				),
			}),
		}
	}
/**
 * Gets a FirelordReference instance that refers to the doc, collection, and collectionGroup at the specified absolute path.
 * @param firestore - A reference to the root `Firestore` instance.
 * @param collectionIDs - all the collectionID(s) needed to build this collection path.
 * @returns Creator function of DocumentReference, CollectionReference and CollectionGroupReference.
 */
export const getFirelord = getFirelordShakable({
	docCreator,
	collectionCreator,
	collectionGroupCreator,
})

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
	FirelordRef,
} from './types'
