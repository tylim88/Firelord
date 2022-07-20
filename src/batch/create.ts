import {
	OriWriteBatch,
	OriDocumentReference,
	OriDocumentData,
	WriteBatchCreate,
} from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const createCreator = (writeBatch: OriWriteBatch): WriteBatchCreate =>
	((reference: OriDocumentReference, data: OriDocumentData) => {
		return writeBatch.create(
			reference,
			removeFieldValueInhomogeneousProps(data)
		)
	}) as WriteBatchCreate
