import { OriTransaction, Transaction } from '../types'

export const getAllCreator =
	(transaction: OriTransaction): Transaction['getAll'] =>
	// @ts-expect-error
	(documentRefs, readOptions) => {
		return transaction.getAll(
			// @ts-expect-error
			...documentRefs,
			readOptions
		)
	}
