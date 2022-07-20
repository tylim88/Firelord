import { setCreator } from './set'
import { updateCreator } from './update'
import { getCreator } from './get'
import { deleteCreator } from './delete'
import { createCreator } from './create'
import { getAllCreator } from './getAll'
import { Firestore, Transaction } from '../types'
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

type RunTransaction = {
	/** 
Executes the given updateFunction and then attempts to commit the changes applied within the transaction. If any document read within the transaction has changed, Cloud Firestore retries the updateFunction. If it fails to commit after 5 attempts, the transaction fails.

The maximum number of writes allowed in a single transaction is 500.

@param firestore
A reference to the Firestore database to run this transaction against. If no value is provided.

@param updateFunction
The function to execute within the transaction context.

@returns
If the transaction completed successfully or was explicitly aborted (the updateFunction returned a failed promise), the promise returned by the updateFunction is returned here. Otherwise, if the transaction failed, a rejected promise with the corresponding failure error is returned.
*/
	<T>(
		firestore: Firestore,
		updateFunction: (transaction: Transaction) => Promise<T>
	): Promise<T>
	/** 
Executes the given updateFunction and then attempts to commit the changes applied within the transaction. If any document read within the transaction has changed, Cloud Firestore retries the updateFunction. If it fails to commit after 5 attempts, the transaction fails.

The maximum number of writes allowed in a single transaction is 500.

@param updateFunction
The function to execute within the transaction context.

@returns
If the transaction completed successfully or was explicitly aborted (the updateFunction returned a failed promise), the promise returned by the updateFunction is returned here. Otherwise, if the transaction failed, a rejected promise with the corresponding failure error is returned.
*/
	<T>(updateFunction: (transaction: Transaction) => Promise<T>): Promise<T>
}
