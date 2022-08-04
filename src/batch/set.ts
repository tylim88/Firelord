import {
	OriWriteBatch,
	OriDocumentReference,
	DocumentData,
	SetOptions,
	WriteBatchSet,
} from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const setCreator = (writeBatch: OriWriteBatch) =>
	((
		reference: OriDocumentReference,
		data: DocumentData,
		options?: SetOptions
	) => {
		return writeBatch.set(
			reference,
			removeFieldValueInhomogeneousProps(data),
			options || {}
		)
	}) as WriteBatchSet
