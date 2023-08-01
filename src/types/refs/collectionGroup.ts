import type { MetaType } from '../metaTypeCreator'
import type { Firestore } from '../alias'
import type { Query } from './query'
import type { QueryPartition } from '@google-cloud/firestore'

/**
 * A {@link CollectionGroup} refers to all documents that are contained in a
 * collection or sub-collection with a specific collection ID.
 */
export interface CollectionGroup<T extends MetaType> extends Query<T> {
	/**
	 * Partitions a query by returning partition cursors that can be used to run
	 * the query in parallel. The returned cursors are split points that can be
	 * used as starting and end points for individual query invocations.
	 *
	 * @param desiredPartitionCount The desired maximum number of partition
	 * points. The number must be strictly positive. The actual number of
	 * partitions returned may be fewer.
	 * @return An AsyncIterable of `QueryPartition`s.
	 */
	getPartitions(desiredPartitionCount: number): AsyncIterable<QueryPartition<T>>
}

export type CollectionGroupFunction<T extends MetaType> = {
	/**
	 *  related documentations:
	 *  - {@link https://firelordjs.com/firelord/quick_start/#query query}
	 *  - {@link https://firelordjs.com/firelord/quick_start/#onsnapshot onSnapshot}
	 * @returns — The created {@link Query}.
	 */
	(): CollectionGroup<T>
}

export type CollectionGroupCreator = <T extends MetaType>(
	fStore: Firestore,
	collectionID: T['collectionID']
) => CollectionGroupFunction<T>
