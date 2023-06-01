import { MetaType } from '../metaTypeCreator'
import { Firestore } from '../alias'
import { QueryConstraints } from '../queryConstraints'
import { QueryConstraintLimitation } from '../queryConstraintsLimitations'
import { CollectionReference } from './collection'
export interface Query<T extends MetaType> {
	/**
	 * The `Firestore` for the Firestore database (useful for performing
	 * transactions, etc.).
	 */
	readonly firestore: Firestore
	/*
	 * Executes the query and returns the results as Node Stream.
	 *
	 * @return A stream of QueryDocumentSnapshot.
	 */
	stream(): NodeJS.ReadableStream // ! revisit
	/**
	 * Creates and returns a new Query instance that applies a field mask to
	 * the result and returns only the specified subset of fields. You can
	 * specify a list of field paths to return, or use an empty list to only
	 * return the references of matching documents.
	 *
	 * Queries that contain field masks cannot be listened to via `onSnapshot()`
	 * listeners.
	 *
	 * This function returns a new (immutable) instance of the Query (rather
	 * than modify the existing instance) to impose the field mask.
	 *
	 * @param field The field paths to return.
	 * @return The created Query.
	 */
	select(...field: (keyof T['writeFlatten'])[]): Query<T> // ! revisit
}

export type QueryRef = <
	T extends MetaType,
	Q extends Query<T> | CollectionReference<T>,
	QC extends QueryConstraints<T>[]
>(
	query: Q extends never ? Q : Query<T> | CollectionReference<T>,

	...queryConstraints: QC extends never
		? QC
		: QueryConstraintLimitation<
				T extends T ? T : T, // ! I seriously don't understand why this is needed or else error, why we cant just T?
				Q,
				QC,
				[],
				QC
		  >
) => Query<T>
