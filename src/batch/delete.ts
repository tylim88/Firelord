import {
	OriWriteBatch,
	OriDocumentReference,
	WriteBatchDelete,
	OriPrecondition,
} from '../types'

export const deleteCreator = (writeBatch: OriWriteBatch) =>
	((reference: OriDocumentReference, precondition?: OriPrecondition) => {
		return writeBatch.delete(reference, precondition || {})
	}) as WriteBatchDelete
