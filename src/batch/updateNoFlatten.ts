import { OriWriteBatch, WriteBatchUpdateNoFlatten } from '../types'
import { flatten } from '../utils'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const updateNoFlattenCreator =
	(writeBatch: OriWriteBatch): WriteBatchUpdateNoFlatten =>
	// @ts-expect-error
	(reference, data, precondition?) => {
		const data_ = flatten(removeFieldValueInhomogeneousProps(data))

		return Object.keys(data_).length > 0
			? writeBatch.update(
					// @ts-expect-error
					reference,
					data_,
					precondition || {}
			  )
			: undefined
	}
