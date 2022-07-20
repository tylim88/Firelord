import {
	MetaType,
	Query,
	CollectionReference,
	QueryConstraints,
	QueryConstraintLimitation,
	AddSentinelFieldPathToCompare,
	AddSentinelFieldPathToCompareHighLevel,
	OriQuery,
	OriCollectionReference,
} from '../types'
import crypto from 'crypto'

/**
 * Creates a new immutable instance of {@link Query} that is extended to also include
 * additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new constraints.
 * @param queryConstraints - The list of {@link QueryConstraint}s to apply.
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
export const query = <
	T extends MetaType,
	Q extends Query<T> | CollectionReference<T>,
	QC extends QueryConstraints<AddSentinelFieldPathToCompare<T>>[]
>(
	query: Q extends never
		? Q
		: Q extends Query<T>
		? Query<T>
		: Q extends CollectionReference<T>
		? CollectionReference<T>
		: never, // has to code this way to infer T perfectly without union Query<T> | CollectionReference<T>
	...queryConstraints: QC extends never
		? QC
		: QueryConstraintLimitation<
				AddSentinelFieldPathToCompare<T>,
				AddSentinelFieldPathToCompareHighLevel<T, Q>,
				QC,
				[],
				QC
		  >
) => {
	const ref = query as OriQuery<T> | OriCollectionReference
	// @ts-expect-error
	return queryConstraints.reduce((ref, qc) => {
		// ! need revisit
		switch (qc.type) {
			case 'where': {
				let value = qc.value
				const opStr = qc.opStr
				if (
					opStr === 'array-contains-any' ||
					opStr === 'in' ||
					opStr === 'not-in'
				) {
					value =
						(value as []).length > 0
							? value
							: [
									crypto.randomUUID() +
										crypto.randomUUID() +
										crypto.randomUUID(),
							  ]
				}
				// @ts-expect-error
				return ref[qc.type](qc.fieldPath, qc.opStr, value)
			}
			case 'orderBy':
				return ref[qc.type](qc.fieldPath, qc.directionStr)
			case 'limit':
				return ref[qc.type](qc.value)
			case 'limitToLast':
				return ref[qc.type](qc.value)
			case 'startAt':
				return ref[qc.type](...qc.values)
			case 'startAfter':
				return ref[qc.type](...qc.values)
			case 'endAt':
				return ref[qc.type](...qc.values)
			case 'endBefore':
				return ref[qc.type](...qc.values)
		}
	}, ref) as Query<T>
}
