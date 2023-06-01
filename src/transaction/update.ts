import { OriTransaction, TransactionUpdate } from '../types'
import { flatten } from '../utils'
import { removeFieldValueInhomogeneousProps } from '../fieldValues'

export const updateCreator =
	(transaction: OriTransaction): TransactionUpdate =>
	// @ts-expect-error
	(reference, data, precondition?) => {
		const data_ = flatten(removeFieldValueInhomogeneousProps(data))

		return Object.keys(data_).length > 0
			? transaction.update(
					// @ts-expect-error
					reference,
					data_,
					precondition || {}
			  )
			: undefined
	}
