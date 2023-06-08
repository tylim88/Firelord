import { DocCreator } from '../types'
import { buildPathFromColIDsAndDocIDs } from './utils'
import { CollectionReference } from 'firebase-admin/firestore'

export const docCreator: DocCreator =
	(fStore, ...collectionIDs) =>
	// @ts-expect-error
	(collectionReferenceOrDocumentId, ...documentIDs) => {
		if (typeof collectionReferenceOrDocumentId === 'string') {
			return fStore.doc(
				buildPathFromColIDsAndDocIDs({
					collectionIDs,
					documentIDs: [collectionReferenceOrDocumentId, ...documentIDs],
				})
			)
		} else {
			return (collectionReferenceOrDocumentId as CollectionReference).doc()
		}
	}
