import { OnSnapshot, OriQuery } from '../types'

export const onSnapshot: OnSnapshot = (reference, onNext, onError) => {
	return (reference as OriQuery).onSnapshot(
		// @ts-expect-error
		onNext,
		onError
	)
}
