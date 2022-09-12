import { setCreator } from './set'
import { updateCreator } from './update'
import { deleteCreator } from './delete'
import { createCreator } from './create'
import { Firestore, WriteBatch } from '../types'
import { getFirestore } from 'firebase-admin/firestore'

/**
 * Creates a write batch, used for performing multiple writes as a single
 * atomic operation.
 * @param firestore Optional, a reference to the Firestore database.
 * If no value is provided, default Firestore instance is used.
 */
export const writeBatch = (firestore?: Firestore): WriteBatch => {
	const batch = (firestore || getFirestore()).batch()
	return {
		commit: () => batch.commit(),
		create: createCreator(batch),
		set: setCreator(batch),
		update: updateCreator(batch),
		delete: deleteCreator(batch),
	}
}
