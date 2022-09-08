import { CollectionCreator } from '../types'

export const collectionCreator: CollectionCreator =
	(fStore, collectionPath) =>
	// @ts-expect-error
	(firestore?) => {
		const fs = firestore || fStore
		return fs.collection(collectionPath)
	}
