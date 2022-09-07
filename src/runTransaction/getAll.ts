import {
	OriTransaction,
	OriDocumentReference,
	Transaction,
	ReadOption,
} from '../types'

export const getAllCreator = (transaction: OriTransaction) =>
	((documentRefs: OriDocumentReference[], readOptions: ReadOption) => {
		return transaction.getAll(...documentRefs, readOptions) as unknown
	}) as Transaction['getAll']
