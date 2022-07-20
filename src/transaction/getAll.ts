import {
	OriTransaction,
	OriDocumentReference,
	Transaction,
	OriReadOption,
} from '../types'

export const getAllCreator = (transaction: OriTransaction) =>
	((documentRefs: OriDocumentReference[], readOptions: OriReadOption) => {
		return transaction.getAll(...documentRefs, readOptions) as unknown
	}) as Transaction['getAll']
