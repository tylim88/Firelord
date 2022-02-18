import { FirelordUtils } from './firelordUtils'
import { FirelordFirestore } from './firelordFirestore'
import { docCreator, DocCreator } from './docCreator'

export const docSnapshotCreator: <
	T extends FirelordUtils.MetaType,
	M extends 'col' | 'colGroup' = 'col'
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference
		: M extends 'colGroup'
		? undefined
		: never,
	documentSnapshot: FirelordFirestore.DocumentSnapshot
) => DocSnapshotCreator<T, M> = <
	T extends FirelordUtils.MetaType,
	M extends 'col' | 'colGroup' = 'col'
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference
		: M extends 'colGroup'
		? undefined
		: never,
	documentSnapshot: FirelordFirestore.DocumentSnapshot
) => {
	type Read = FirelordUtils.InternalReadWriteConverter<T>['read']

	return {
		createTime: documentSnapshot.createTime,
		updateTime: documentSnapshot.updateTime,
		exists: documentSnapshot.exists,
		id: documentSnapshot.id,
		readTime: documentSnapshot.readTime,
		ref: docCreator<T, M>(
			firestore,
			colRef,
			documentSnapshot.ref
		)(documentSnapshot.ref.id),
		data: () => {
			return documentSnapshot.data() as T['read'] | undefined
		},
		get: <F extends string & keyof T['writeFlatten']>(fieldPath: F) => {
			return documentSnapshot.get(fieldPath) as Read[F]
		},
		isEqual: (other: FirelordFirestore.DocumentSnapshot) => {
			return documentSnapshot.isEqual(
				other as FirelordFirestore.DocumentSnapshot<Read>
			)
		},
	}
}

export type DocSnapshotCreator<
	T extends FirelordUtils.MetaType,
	M extends 'col' | 'colGroup' = 'col'
> = {
	createTime?: FirelordFirestore.Timestamp
	updateTime?: FirelordFirestore.Timestamp
	exists: boolean
	id: string
	readTime: FirelordFirestore.Timestamp
	ref: ReturnType<DocCreator<T, M>>
	data: () => T['read'] | undefined
	get: <F extends string & keyof T['writeFlatten']>(
		fieldPath: F
	) => T['read'][F]
	isEqual: (other: FirelordFirestore.DocumentSnapshot) => boolean
}
