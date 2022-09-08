import { MetaType, OriQuery, QueryRef } from '../types'
import { handleEmptyArray } from './utils'

/**
 * Creates a new immutable instance of {@link Query} that is extended to also include
 * additional query constraints.
 *
 * @param query - The {@link Query} instance to use as a base for the new constraints.
 * @param queryConstraints - The list of {@link QueryConstraint}s to apply.
 * @throws if any of the provided query constraints cannot be combined with the
 * existing or new constraints.
 */
// @ts-expect-error
export const query: QueryRef = (query, ...queryConstraints) => {
	const ref = query as OriQuery<MetaType>
	// ! need revisit
	// @ts-expect-error
	return queryConstraints.reduce((ref, qc) => {
		const type = qc.type
		if (type === 'where') {
			return ref[type](qc.fieldPath, qc.opStr, qc.value)
		} else if (type === 'orderBy') {
			return ref[type](qc.fieldPath, qc.directionStr)
		} else if (type === 'limit' || type === 'limitToLast') {
			return ref[type](qc.value)
		} else if (
			type === 'startAt' ||
			type === 'startAfter' ||
			type === 'endAt' ||
			type === 'endBefore'
		) {
			return handleEmptyArray(qc.values, ref, () => ref[type](...qc.values))
		}
	}, ref)
}
