import { DocumentSnapshot, QuerySnapshot } from '../snapshot'
import { MetaType } from '../metaTypeCreator'
import { Query, DocumentReference } from '../refs'
import { Unsubscribe } from '../alias'

export type OnSnapshot = {
	/**
	 * listen to filtered collection, entire collection or single document
	 *
	 * Attaches a listener for {@link DocumentSnapshot} Or {@link QuerySnapshot} events. You may either pass
	 * individual {@link onNext} and {@link onError} callbacks. The listener can be cancelled by
	 * calling the function that is returned when {@link OnSnapshot} is called.
	 *
	 * related documentation:
	 *  - {@link https://firelordjs.com/firelord/quick_start#onsnapshot}
	 *
	 * @param reference
	 *
	 * Type 1: {@link Query} eg: query(example.collection(...), ...) listen to filtered collection
	 *
	 * Type 2: CollectionGroup({@link Query}) eg: query(example.collectionGroup(...), ...) listen to filtered {@link Query}
	 *
	 * Type 3: {@link CollectionReference} eg: example.collection(...) listen to entire collection
	 *
	 * Type 4: CollectionGroup({@link Query}) reference eg: example.collectionGroup(...) listen to entire {@link Query}
	 *
	 * Type 5: {@link DocumentReference} eg: example.doc(...) listen to a single document
	 * @param onNext - A callback to be called every time a new {@link DocumentSnapshot} or {@link QuerySnapshot} is available.
	 *
	 * Type 1: receive {@link DocumentSnapshot} if {@link reference} is {@link DocumentReference} eg: (value: {@link DocumentSnapshot}) => { handle data here }
	 *
	 * Type 2: receive {@link QuerySnapshot} if {@link reference} is CollectionGroup or {@link Query} or {@link CollectionReference} eg: (value: {@link QuerySnapshot}) => { handle data here }
	 *
	 * @param onError - optional parameter. A callback to be called if the listen fails or is cancelled. No further callbacks will occur. Eg: (error: {@link FirestoreError})=> { handle error here}
	 *
	 * @returns An unsubscribe function that can be called to cancel
	 * the snapshot listener.
	 */
	<T extends MetaType, Ref extends Query<T> | DocumentReference<T>>(
		reference: Ref extends never ? Ref : Query<T> | DocumentReference<T>,
		onNext: (
			snapshot: Ref extends DocumentReference<T>
				? DocumentSnapshot<T>
				: QuerySnapshot<T>
		) => void,
		onError?: (error: Error) => void
	): Unsubscribe
}
