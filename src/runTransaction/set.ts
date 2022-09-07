import {
	OriTransaction,
	OriDocumentReference,
	DocumentData,
	TransactionSet,
	SetOptions,
} from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const setCreator = (transaction: OriTransaction) =>
	((
		reference: OriDocumentReference,
		data: DocumentData,
		options?: SetOptions
	) => {
		return transaction.set(
			reference,
			removeFieldValueInhomogeneousProps(data),
			options || {}
		) as unknown
	}) as TransactionSet
