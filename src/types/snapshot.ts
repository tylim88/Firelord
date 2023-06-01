import { MetaType } from './metaTypeCreator'
import { DocumentChangeType, Timestamp } from './alias'
import { DocumentReference, Query } from './refs'
import { DeepValue, ObjectFlatten } from './objectFlatten'

export interface DocumentSnapshot<T extends MetaType> {
	/** True if the document exists. */
	readonly exists: boolean

	/** A `DocumentReference` to the document location. */
	readonly ref: DocumentReference<T>

	/**
	 * The ID of the document for which this `DocumentSnapshot` contains data.
	 */
	readonly id: T['docID']

	/**
	 * The time the document was created. Not set for documents that don't
	 * exist.
	 */
	readonly createTime?: Timestamp

	/**
	 * The time the document was last updated (at the time the snapshot was
	 * generated). Not set for documents that don't exist.
	 */
	readonly updateTime?: Timestamp

	/**
	 * The time this snapshot was read.
	 */
	readonly readTime: Timestamp

	/**
	 * Retrieves all fields in the document as an Object. Returns 'undefined' if
	 * the document doesn't exist.
	 *
	 * @return An Object containing all fields in the document.
	 */
	data(): T['read'] | undefined
	/**
	 * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
	 * document or field doesn't exist.
	 *
	 * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
	 * field.
	 * @returns The data at the specified field location or undefined if no such
	 * field exists in the document.
	 */
	get<FieldPath extends keyof T['writeFlatten'] & string>(
		fieldPath: FieldPath
	): DeepValue<ObjectFlatten<T['read']>, FieldPath> | undefined
}

export interface QuerySnapshot<T extends MetaType> {
	/**
	 * The query on which you called `get` or `onSnapshot` in order to get this
	 * `QuerySnapshot`.
	 */
	readonly query: Query<T>

	/** An array of all the documents in the QuerySnapshot. */
	readonly docs: Array<QueryDocumentSnapshot<T>>

	/** The number of documents in the QuerySnapshot. */
	readonly size: number

	/** True if there are no documents in the QuerySnapshot. */
	readonly empty: boolean

	/** The time this query snapshot was obtained. */
	readonly readTime: Timestamp

	/**
	 * Returns an array of the documents changes since the last snapshot. If
	 * this is the first snapshot, all documents will be in the list as added
	 * changes.
	 */
	docChanges(): DocumentChange<T>[]

	/**
	 * Enumerates all of the documents in the QuerySnapshot.
	 *
	 * @param callback A callback to be called with a `DocumentSnapshot` for
	 * each document in the snapshot.
	 * @param thisArg The `this` binding for the callback.
	 */
	forEach(
		callback: (result: QueryDocumentSnapshot<T>) => void,
		thisArg?: unknown
	): void
}

export interface QueryDocumentSnapshot<T extends MetaType>
	extends DocumentSnapshot<T> {
	/**
	 * The time the document was created.
	 */
	readonly createTime: Timestamp

	/**
	 * The time the document was last updated (at the time the snapshot was
	 * generated).
	 */
	readonly updateTime: Timestamp

	/**
	 * Retrieves all fields in the document as an Object.
	 *
	 * @override
	 * @return An Object containing all fields in the document.
	 */
	data: () => T['read']
}

export interface DocumentChange<T extends MetaType> {
	/** The type of change ('added', 'modified', or 'removed'). */
	readonly type: DocumentChangeType

	/** The document affected by this change. */
	readonly doc: QueryDocumentSnapshot<T>

	/**
	 * The index of the changed document in the result set immediately prior to
	 * this DocumentChange (i.e. supposing that all prior DocumentChange objects
	 * have been applied). Is -1 for 'added' events.
	 */
	readonly oldIndex: number

	/**
	 * The index of the changed document in the result set immediately after
	 * this DocumentChange (i.e. supposing that all prior DocumentChange
	 * objects and the current DocumentChange object have been applied).
	 * Is -1 for 'removed' events.
	 */
	readonly newIndex: number

	/**
	 * Returns true if the data in this `DocumentChange` is equal to the
	 * provided one.
	 *
	 * @param other The `DocumentChange` to compare against.
	 * @return true if this `DocumentChange` is equal to the provided one.
	 */
	isEqual(other: DocumentChange<T>): boolean // ! revisit
}

export interface AggregateQuerySnapshot<T extends MetaType> {
	readonly query: Query<T>
	/**
	 * @returns An `Object` containing `count` properties. See https://firebase.blog/posts/2022/12/introducing-firestore-count-ttl-scale
	 */
	data(): { count: number }
}
