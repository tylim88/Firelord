import {
	OriWriteBatch,
	OriDocumentReference,
	WriteBatchDelete,
	Precondition,
} from '../types'

export const deleteCreator = (writeBatch: OriWriteBatch) =>
	((reference: OriDocumentReference, precondition?: Precondition) => {
		return writeBatch.delete(reference, precondition || {})
	}) as WriteBatchDelete
