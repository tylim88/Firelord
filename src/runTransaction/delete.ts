import { OriTransaction, TransactionDelete, Precondition } from '../types'

export const deleteCreator =
	(
		transaction: OriTransaction,
		precondition?: Precondition
	): TransactionDelete =>
	// @ts-expect-error
	reference => {
		return transaction.delete(
			// @ts-expect-error
			reference,
			precondition || {}
		)
	}
