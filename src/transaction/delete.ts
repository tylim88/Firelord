import {
	OriDocumentReference,
	OriTransaction,
	TransactionDelete,
	Precondition,
} from '../types'

export const deleteCreator = (
	transaction: OriTransaction,
	precondition?: Precondition
) =>
	((reference: OriDocumentReference) => {
		return transaction.delete(reference, precondition || {}) as unknown
	}) as TransactionDelete
