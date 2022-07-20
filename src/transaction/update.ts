import {
	OriTransaction,
	OriDocumentReference,
	TransactionUpdate,
	OriPrecondition,
} from '../types'
import { flatten } from '../utils'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const updateCreator = (transaction: OriTransaction) =>
	((
		reference: OriDocumentReference,
		data: Record<string, unknown>,
		precondition?: OriPrecondition
	) => {
		const data_ = flatten(removeFieldValueInhomogeneousProps(data))

		return Object.keys(data_).length > 0
			? transaction.update(
					reference,
					flatten(removeFieldValueInhomogeneousProps(data)) as Record<
						string,
						undefined
					>,
					precondition || {}
			  )
			: (undefined as unknown)
	}) as TransactionUpdate
