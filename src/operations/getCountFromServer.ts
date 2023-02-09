import { OriQuery, GetCountFromServer } from '../types'

/**
 * Returns a query that counts the documents in the result set of this
 * query.
 *
 * The returned query, when executed, counts the documents in the result set
 * of this query without actually downloading the documents.
 *
 * Using the returned query to count the documents is efficient because only
 * the final count, not the documents' data, is downloaded. The returned
 * query can even count the documents if the result set would be
 * prohibitively large to download entirely (e.g. thousands of documents).
 *
 * @return a query that counts the documents in the result set of this
 * query. The count can be retrieved from `snapshot.data().count`, where
 * `snapshot` is the `AggregateQuerySnapshot` resulting from running the
 * returned query.
 */
// @ts-expect-error
export const getCountFromServer: GetCountFromServer = query => {
	return (query as OriQuery).count().get()
}
