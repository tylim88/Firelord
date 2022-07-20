import {
	OriTransaction,
	OriDocumentReference,
	OriDocumentData,
	TransactionCreate,
} from '../types'
import { removeFieldValueInhomogeneousProps } from '../fieldValue'

export const createCreator = (transaction: OriTransaction) =>
	((reference: OriDocumentReference, data: OriDocumentData) => {
		return transaction.create(
			reference,
			removeFieldValueInhomogeneousProps(data)
		) as unknown
	}) as TransactionCreate
