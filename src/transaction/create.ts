import { OriTransaction, TransactionCreate } from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const createCreator =
	(transaction: OriTransaction): TransactionCreate =>
	// @ts-expect-error
	(reference, data) => {
		return transaction.create(
			// @ts-expect-error
			reference,
			removeFieldValueInhomogeneousProps(data)
		)
	}
