import { CollectionGroupCreator } from '../types'

export const collectionGroupCreator: CollectionGroupCreator =
	(fStore, collectionID) =>
	// @ts-expect-error
	() => {
		return fStore.collectionGroup(collectionID)
	}
