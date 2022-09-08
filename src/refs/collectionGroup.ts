import { CollectionGroupCreator } from '../types'

export const collectionGroupCreator: CollectionGroupCreator =
	(fStore, collectionID) =>
	// @ts-expect-error
	(firestore?) => {
		const fs = firestore || fStore
		return fs.collectionGroup(collectionID)
	}
