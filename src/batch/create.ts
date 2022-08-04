import {
	OriWriteBatch,
	OriDocumentReference,
	DocumentData,
	WriteBatchCreate,
} from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const createCreator = (writeBatch: OriWriteBatch): WriteBatchCreate =>
	((reference: OriDocumentReference, data: DocumentData) => {
		return writeBatch.create(
			reference,
			removeFieldValueInhomogeneousProps(data)
		)
	}) as WriteBatchCreate
