import { CollectionCreator } from '../types'
import { buildPathFromColIDsAndDocIDs } from './utils'

export const collectionCreator: CollectionCreator =
	(fStore, collectionIDs) =>
	// @ts-expect-error
	(...documentIDs) => {
		return fStore.collection(
			buildPathFromColIDsAndDocIDs({
				collectionIDs,
				documentIDs,
			})
		)
	}
