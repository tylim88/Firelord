import { OriWriteBatch, WriteBatchCreate } from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const createCreator =
	(writeBatch: OriWriteBatch): WriteBatchCreate =>
	// @ts-expect-error
	(reference, data) => {
		return writeBatch.create(
			// @ts-expect-error
			reference,
			removeFieldValueInhomogeneousProps(data)
		)
	}
