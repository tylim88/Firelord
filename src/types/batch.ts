import { WriteBatchSet } from './set'
import { WriteBatchUpdate } from './update'
import { WriteBatchDelete } from './delete'
import { WriteBatchCreate } from './create'
import { WriteResult } from './alias'

export interface WriteBatch {
	/**
	 * Create the document referred to by the provided `DocumentReference`. The
	 * operation will fail the batch if a document exists at the specified
	 * location.
	 *
	 * @param documentRef A reference to the document to be created.
	 * @param data The object data to serialize as the document.
	 * @throws Error If the provided input is not a valid Firestore document.
	 * @return This `WriteBatch` instance. Used for chaining method calls.
	 */
	create: WriteBatchCreate
	/**
	 * Write to the document referred to by the provided `DocumentReference`.
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
	 * @return This `WriteBatch` instance. Used for chaining method calls.
	 */
	set: WriteBatchSet
	/**
	 * Update fields of the document referred to by the provided
	 * `DocumentReference`. If the document doesn't yet exist, the update fails
	 * and the entire batch will be rejected.
	 *
	 * Nested fields can be updated by providing dot-separated field path
	 * strings.
	 *
	 * @param documentRef A reference to the document to be updated.
	 * @param data An object containing the fields and values with which to
	 * update the document.
	 * @param precondition A Precondition to enforce on this update.
	 * @throws Error If the provided input is not valid Firestore data.
	 * @return This `WriteBatch` instance. Used for chaining method calls.
	 */
	update: WriteBatchUpdate
	/**
	 * Deletes the document referred to by the provided `DocumentReference`.
	 *
	 * @param documentRef A reference to the document to be deleted.
	 * @param precondition A Precondition to enforce for this delete.
	 * @return This `WriteBatch` instance. Used for chaining method calls.
	 */
	delete: WriteBatchDelete
	/**
	 * Commits all of the writes in this write batch as a single atomic unit.
	 *
	 * @return A Promise resolved once all of the writes in the batch have been
	 * successfully written to the backend as an atomic unit.
	 */
	commit(): Promise<WriteResult[]>
}
