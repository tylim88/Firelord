import { OrderBy } from '../types'

/**
 * Creates a `QueryConstraint` that sorts the query result by the
 * specified field, optionally in descending order instead of ascending.
 *
 * @param fieldPath - The field to sort by.
 * @param directionStr - Optional direction to sort by ('asc' or 'desc'). If
 * not specified, order will be ascending.
 * @returns The created `Query`.
 */
// @ts-expect-error
export const orderBy: OrderBy = (fieldPath, directionStr) => {
	return {
		type: 'orderBy',
		fieldPath,
		directionStr,
	}
}
