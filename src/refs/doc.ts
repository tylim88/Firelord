import { DocCreator } from '../types'
import { buildPathFromColIDsAndDocIDs } from './utils'

export const docCreator: DocCreator =
	(fStore, collectionIDs) =>
	// @ts-expect-error
	(...documentIDs) => {
		return fStore.doc(
			buildPathFromColIDsAndDocIDs({
				collectionIDs,
				documentIDs,
			})
		)
	}
