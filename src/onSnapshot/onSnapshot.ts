import {
	MetaType,
	Query,
	DocumentReference,
	OriQuery,
	Unsubscribe,
	DocumentSnapshot,
	QuerySnapshot,
} from '../types'

export const onSnapshot: OnSnapshot = (reference, onNext, onError) => {
	return (reference as OriQuery).onSnapshot(
		// @ts-expect-error
		onNext,
		onError
	)
}

type OnSnapshot = {
	/**
	 * Attaches a listener for `DocumentSnapshot` events. You may either pass
	 * individual `onNext` and `onError` callbacks or pass a single observer
	 * object with `next` and `error` callbacks.
	 *
	 * NOTE: Although an `onCompletion` callback can be provided, it will
	 * never be called because the snapshot stream is never-ending.
	 *
	 * @param reference - A reference to the document to listen to.
	 * @param onNext - A callback to be called every time a new `DocumentSnapshot`
	 * is available.
	 * @param onError - An optional callback to be called if the listen fails or is
	 * cancelled. No further callbacks will occur.
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
