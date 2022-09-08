import { OriQuery, GetDocs } from '../types'

/**
 * Executes the query and returns the results as a `QuerySnapshot`.
 * @param reference — The reference of the collection or collection group to fetch.
 * @returns A `Promise` that will be resolved with the results of the query.
 */
// @ts-expect-error
export const getDocs: GetDocs = query => {
	return (query as OriQuery).get()
}
