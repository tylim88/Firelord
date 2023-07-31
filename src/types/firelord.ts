import { GetOddOrEvenSegments, EmptyObject } from './utils'
import { MetaType } from './metaTypeCreator'
import {
	Query,
	Doc,
	Collection,
	DocCreator,
	CollectionCreator,
	CollectionGroupCreator,
} from './refs'
import { Firestore } from './alias'

type Doc_<T extends MetaType> = {
	doc: Doc<T>
}

type Collection_<T extends MetaType> = {
	collection: Collection<T>
}

type CollectionGroup_<T extends MetaType> = {
	/**
	 *  related documentations:
	 *  - {@link https://firelordjs.com/quick_start/#query query}
	 *  - {@link https://firelordjs.com/quick_start/#onsnapshot onSnapshot}
	 * @returns — The created {@link Query}.
	 */
	collectionGroup: () => Query<T>
}

export type Creators = {
	docCreator: DocCreator
	collectionCreator: CollectionCreator
	collectionGroupCreator: CollectionGroupCreator
}
export type FirelordRef<
	T extends MetaType,
	H extends Partial<Creators> = Creators
> = (unknown extends H['docCreator'] ? EmptyObject : Doc_<T>) &
	(unknown extends H['collectionCreator'] ? EmptyObject : Collection_<T>) &
	(unknown extends H['collectionGroupCreator']
		? EmptyObject
		: CollectionGroup_<T>)

export type GetFirelordShakable = <H extends Partial<Creators>>(
	creators: H
) => GetFirelord<H>

export type GetFirelord<H extends Partial<Creators>> = <T extends MetaType>(
	firestore: Firestore,
	...collectionIDs: GetOddOrEvenSegments<T['collectionPath'], 'Odd'>
) => FirelordRef<T, H>

// ! this will error even though they are the exact same code
// export type GetFirelordShakable = <H extends Partial<Creators>>(
// 	creators: H
// ) => <T extends MetaType>(
// 	firestore: Firestore,
// 	...collectionIDs: GetOddOrEvenSegments<T['collectionPath'], 'Odd'>
// ) => FirelordRef<T, H>
