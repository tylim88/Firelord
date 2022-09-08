import { DocCreator } from '../types'
import { isFirestore } from '../utils'

export const docCreator: DocCreator =
	(fStore, collectionPath) =>
	// @ts-expect-error
	(firestore, documentId) => {
		const fs = isFirestore(firestore) ? firestore : fStore
		const docId = isFirestore(firestore) ? documentId : firestore
		return fs.doc(collectionPath + '/' + docId)
	}
