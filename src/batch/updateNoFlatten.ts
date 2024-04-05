import { OriWriteBatch, WriteBatchUpdateNoFlatten } from '../types'
import { flatten } from '../utils'
import { removeFieldValueInhomogeneousProps } from '../fieldValues'

export const updateNoFlattenCreator =
	(writeBatch: OriWriteBatch): WriteBatchUpdateNoFlatten =>
	// @ts-expect-error
	(reference, data, precondition) => {
		const data_ = flatten(removeFieldValueInhomogeneousProps(data))

		return writeBatch.update(
			// @ts-expect-error
			reference,
			data_,
			precondition || {}
		)
	}
