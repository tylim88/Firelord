import { OriTransaction, TransactionUpdate } from '../types'
import { flatten } from '../utils'
import { removeFieldValueInhomogeneousProps } from '../fieldValues'

export const updateCreator =
	(transaction: OriTransaction): TransactionUpdate =>
	// @ts-expect-error
	(reference, data, precondition) => {
		return transaction.update(
			// @ts-expect-error
			reference,
			flatten(removeFieldValueInhomogeneousProps(data)),
			precondition || {}
		)
	}
