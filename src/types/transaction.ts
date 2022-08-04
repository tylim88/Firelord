import { TransactionSet } from './set'
import { TransactionUpdate } from './update'
import { TransactionDelete } from './delete'
import { TransactionCreate } from './create'
import { DocumentReference, Query } from './refs'
import { DocumentSnapshot, QuerySnapshot } from './snapshot'
import { MetaType } from './metaTypeCreator'
import { Firestore } from './ori'

/**
 * An options object that can be used to configure the behavior of `getAll()`
 * calls. By providing a `fieldMask`, these calls can be configured to only
 * return a subset of fields.
 */
export interface ReadOptions<T extends MetaType> {
	/**
	 * Specifies the set of fields to return and reduces the amount of data
	 * transmitted by the backend.
	 *
	 * Adding a field mask does not filter results. Documents do not need to
	 * contain values for all the fields in the mask to be part of the result
	 * set.
	 */
	readonly fieldMask?: (keyof T['writeFlatten'])[]
}

export interface Transaction {
	/**
	 * Retrieves a query result. Holds a pessimistic lock on all returned
	 * documents.
	 *
	 * @param query A query to execute.
	 * @return A QuerySnapshot for the retrieved data.
	 */
	get<T extends MetaType>(reference: Query<T>): Promise<QuerySnapshot<T>>
	/**
	 * Reads the document referenced by the provided `DocumentReference`.
	 *
	 * @param documentRef - A reference to the document to be read.
	 * @returns A `DocumentSnapshot` with the read data.
	 */
	get<T extends MetaType>(
		reference: DocumentReference<T>
	): Promise<DocumentSnapshot<T>>
	/**
	 * Retrieves multiple documents from Firestore. Holds a pessimistic lock on
	 * all returned documents.
	 * @param {Array.<DocumentReference|ReadOptions>} documentRefs
	 * The `DocumentReferences` to receive
	 * @param {ReadOptions|undefined} readOptions
	 * An options object that can be used to configure the behavior of `getAll()`
	 * calls. By providing a `fieldMask`, these calls can be configured to only
	 * return a subset of fields.
	 *
	 * Specifies the set of fields to return and reduces the amount of data
	 * transmitted by the backend.
	 *
	 * Adding a field mask does not filter results. Documents do not need to
	 * contain values for all the fields in the mask to be part of the result
	 * set.
	 * @return A Promise that resolves with an array of resulting document
	 * snapshots.
	 */
	getAll<T extends MetaType>(
		documentRefs: DocumentReference<T>[],
		readOptions?: ReadOptions<T>
	): Promise<Array<DocumentSnapshot<T>>>
	/**
	 * Create the document referred to by the provided `DocumentReference`.
	 * The operation will fail the transaction if a document exists at the
	 * specified location.
	 *
	 * @param documentRef A reference to the document to be create.
	 * @param data The object data to serialize as the document.
	 * @throws Error If the provided input is not a valid Firestore document.
	 * @return This `Transaction` instance. Used for chaining method calls.
	 */
	create: TransactionCreate
	/**
	 * Writes to the document referred to by the provided `DocumentReference`.
	 * If the document does not exist yet, it will be created. If you pass
	 * `SetOptions`, the provided data can be merged into the existing document.
	 *
	 * @param documentRef A reference to the document to be set.
	 * @param data An object of the fields and values for the document.
	 * @param options An object to configure the set behavior.
	 * @param  options.merge - If true, set() merges the values specified in its
	 * data argument. Fields omitted from this set() call remain untouched.
	 * @param options.mergeFields - If provided, set() only replaces the
	 * specified field paths. Any field path that is not specified is ignored
	 * and remains untouched.
	 * @throws Error If the provided input is not a valid Firestore document.
	 * @return This `Transaction` instance. Used for chaining method calls.
	 */
	set: TransactionSet
	/**
     * Updates fields in the document referred to by the provided `DocumentReference`. 
	 * The update will fail if applied to a document that does not exist.
	 * @param documentRef - A reference to the document to be updated.
	 * @param data - An object containing the fields and values with which to
	update the document. Fields can contain dots to reference nested fields
	within the document.
		 * @throws Error - If the provided input is not valid Firestore data.
		 * @returns This `Transaction` instance. Used for chaining method calls.
		 */
	update: TransactionUpdate
	/**
	 * Deletes the document referred to by the provided `DocumentReference`.
	 *
	 * @param documentRef A reference to the document to be deleted.
	 * @param precondition A Precondition to enforce for this delete.
	 * @return This `Transaction` instance. Used for chaining method calls.
	 */
	delete: TransactionDelete
}

export type RunTransaction = {
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
