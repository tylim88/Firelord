import {
	OriWriteBatch,
	OriDocumentReference,
	WriteBatchUpdate,
	Precondition,
} from '../types'
import { flatten } from '../utils'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const updateCreator = (writeBatch: OriWriteBatch) =>
	((
		reference: OriDocumentReference,
		data: Record<string, unknown>,
		precondition?: Precondition
	) => {
		const data_ = flatten(removeFieldValueInhomogeneousProps(data))

		return Object.keys(data_).length > 0
			? writeBatch.update(
					reference,
					// @ts-expect-error
					data_,
					precondition || {}
			  )
			: undefined
	}) as WriteBatchUpdate
