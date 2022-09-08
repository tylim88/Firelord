import { setCreator } from './set'
import { updateCreator } from './update'
import { getCreator } from './get'
import { deleteCreator } from './delete'
import { createCreator } from './create'
import { getAllCreator } from './getAll'
import { RunTransaction } from '../types'
import { getFirestore } from 'firebase-admin/firestore'
import { isFirestore } from '../utils'
import { isTransactionOptions } from './utils'

/**
 * Executes the given updateFunction and commits the changes applied within
 * the transaction.
 *
 * You can use the transaction object passed to 'updateFunction' to read and
 * modify Firestore documents under lock. You have to perform all reads
 * before before you perform any write.
 *
 * Transactions can be performed as read-only or read-write transactions. By
 * default, transactions are executed in read-write mode.
 *
 * A read-write transaction obtains a pessimistic lock on all documents that
 * are read during the transaction. These locks block other transactions,
 * batched writes, and other non-transactional writes from changing that
 * document. Any writes in a read-write transactions are committed once
 * 'updateFunction' resolves, which also releases all locks.
 *
 * If a read-write transaction fails with contention, the transaction is
 * retried up to five times. The `updateFunction` is invoked once for each
 * attempt.
 *
 * Read-only transactions do not lock documents. They can be used to read
 * documents at a consistent snapshot in time, which may be up to 60 seconds
 * in the past. Read-only transactions are not retried.
 *
 * Transactions time out after 60 seconds if no documents are read.
 * Transactions that are not committed within than 270 seconds are also
 * aborted. Any remaining locks are released when a transaction times out.
 *
 * @param updateFunction The function to execute within the transaction
 * context.
 * @param transactionOptions Transaction options.
 * @return If the transaction completed successfully or was explicitly
 * aborted (by the updateFunction returning a failed Promise), the Promise
 * returned by the updateFunction will be returned here. Else if the
 * transaction failed, a rejected Promise with the corresponding failure
 * error will be returned.
 */
// @ts-expect-error
export const runTransaction: RunTransaction = (
	firestore,
	updateFunction,
	transactionOptions
) => {
	const fStore = isFirestore(firestore) ? firestore : getFirestore()
	const callback = isFirestore(firestore) ? updateFunction : firestore
	const options = isTransactionOptions(updateFunction)
		? updateFunction
		: transactionOptions

	return fStore.runTransaction(async transaction => {
		const create = createCreator(transaction)
		const set = setCreator(transaction)
		const update = updateCreator(transaction)
		const get = getCreator(transaction)
		const delete_ = deleteCreator(transaction)
		const getAll = getAllCreator(transaction)
		return callback({ set, update, get, delete: delete_, create, getAll })
	}, options)
}
