import { LimitCreator } from '../types'

export const limitCreator: LimitCreator =
	type =>
	// @ts-expect-error
	limit => {
		return {
			type,
			value: limit,
		}
	}

/**
 * Creates a {@link QueryConstraint} that only returns the first matching documents.
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link Query}.
 */
export const limit = limitCreator('limit')

/**
 * Creates a {@link QueryConstraint} that only returns the last matching documents.
 *
 * You must specify at least one `orderBy` clause for `limitToLast` queries,
 * otherwise an exception will be thrown during execution.(Prevented on type level)
 *
 * @param limit - The maximum number of items to return.
 * @returns The created {@link Query}.
 */
export const limitToLast = limitCreator('limitToLast')
