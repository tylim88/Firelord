import { MetaType, CollectionReference, Firestore } from '../types'

export const collectionCreator =
	<T extends MetaType>(
		fStore: Firestore,
		collectionPath: T['collectionPath']
	) =>
	(firestore?: Firestore) => {
		const fs = firestore || fStore
		return fs.collection(collectionPath) as CollectionReference<T>
	}
