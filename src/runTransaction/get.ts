import { OriTransaction, Transaction } from '../types'

export const getCreator =
	(transaction: OriTransaction): Transaction['get'] =>
	// @ts-expect-error
	reference => {
		return transaction.get(
			// @ts-expect-error
			reference
		)
	}
