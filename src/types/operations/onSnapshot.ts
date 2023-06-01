import { DocumentSnapshot, QuerySnapshot } from '../snapshot'
import { MetaType } from '../metaTypeCreator'
import { Query, DocumentReference } from '../refs'
import { Unsubscribe } from '../alias'

export type OnSnapshot = {
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
