import { DocCreator } from '../types'
import { buildPathFromColIDsAndDocIDs } from './utils'

export const docCreator: DocCreator =
	(fStore, ...collectionIDs) =>
	// @ts-expect-error
	(collectionReferenceOrDocumentId, ...documentIDs) => {
		if (typeof collectionReferenceOrDocumentId === 'string') {
			return fStore.doc(
				buildPathFromColIDsAndDocIDs({
					collectionIDs,
					documentIDs: [
						collectionReferenceOrDocumentId,
						// @ts-expect-error
						...documentIDs,
					],
				})
			)
		} else {
			// @ts-expect-error
			return collectionReferenceOrDocumentId.doc()
		}
	}
