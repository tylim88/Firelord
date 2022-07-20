import { MetaType, Query, QuerySnapshot, OriQuery } from '../types'

/**
 * Executes the query and returns the results as a `QuerySnapshot`.
 * @param reference — The reference of the collection or collection group to fetch.
 * @returns A `Promise` that will be resolved with the results of the query.
 */
export const getDocs = <T extends MetaType>(query: Query<T>) => {
	return (query as OriQuery).get() as unknown as Promise<QuerySnapshot<T>>
}
