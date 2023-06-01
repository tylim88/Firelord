import { MetaType } from '../metaTypeCreator'
import { Firestore } from '../alias'
import { Query } from './query'
import { QueryPartition } from '@google-cloud/firestore'

/**
 * A `CollectionGroup` refers to all documents that are contained in a
 * collection or subcollection with a specific collection ID.
 */
interface CollectionGroup<T extends MetaType> extends Query<T> {
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

export type CollectionGroupCreator = <T extends MetaType>(
	fStore: Firestore,
	collectionID: T['collectionID']
) => () => CollectionGroup<T>
