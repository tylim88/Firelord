import { setCreator } from './set'
import { updateCreator } from './update'
import { getCreator } from './get'
import { deleteCreator } from './delete'
import { createCreator } from './create'
import { getAllCreator } from './getAll'
import { RunTransaction } from '../types'
import { getFirestore } from 'firebase-admin/firestore'
import { isFirestore } from '../utils'

// @ts-expect-error
export const runTransaction: RunTransaction = (firestore, updateFunction) => {
	const fStore = isFirestore(firestore) ? firestore : getFirestore()
	const callback = isFirestore(firestore) ? updateFunction : firestore
	return fStore.runTransaction(async transaction => {
		const create = createCreator(transaction)
		const set = setCreator(transaction)
		const update = updateCreator(transaction)
		const get = getCreator(transaction)
		const delete_ = deleteCreator(transaction)
		const getAll = getAllCreator(transaction)
		return callback({ set, update, get, delete: delete_, create, getAll })
	})
}
