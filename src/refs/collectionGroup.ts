import { MetaType, Firestore, Query } from '../types'

export const collectionGroupCreator =
	<T extends MetaType>(fStore: Firestore, collectionID: T['collectionID']) =>
	(firestore?: Firestore) => {
		const fs = firestore || fStore
		return fs.collectionGroup(collectionID) as Query<T>
	}
