import { OriWriteBatch, WriteBatchDelete } from '../types'

export const deleteCreator =
	(writeBatch: OriWriteBatch): WriteBatchDelete =>
	// @ts-expect-error
	(reference, precondition) => {
		return writeBatch.delete(
			// @ts-expect-error
			reference,
			precondition || {}
		)
	}
