import {
	OriDocumentReference,
	OriTransaction,
	TransactionDelete,
	OriPrecondition,
} from '../types'

export const deleteCreator = (
	transaction: OriTransaction,
	precondition?: OriPrecondition
) =>
	((reference: OriDocumentReference) => {
		return transaction.delete(reference, precondition || {}) as unknown
	}) as TransactionDelete
