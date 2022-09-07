import {
	OriTransaction,
	OriDocumentReference,
	DocumentData,
	TransactionCreate,
} from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const createCreator = (transaction: OriTransaction) =>
	((reference: OriDocumentReference, data: DocumentData) => {
		return transaction.create(
			reference,
			removeFieldValueInhomogeneousProps(data)
		) as unknown
	}) as TransactionCreate
