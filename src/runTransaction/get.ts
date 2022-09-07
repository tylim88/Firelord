import { OriTransaction, OriDocumentReference, Transaction } from '../types'

export const getCreator = (transaction: OriTransaction) =>
	((reference: OriDocumentReference) => {
		return transaction.get(reference) as unknown
	}) as Transaction['get']
