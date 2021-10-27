import { firestore } from './firelordFirestore'
import { Firelord } from './firelord'

export const increment = (value: number) => {
	return firestore.FieldValue.increment(value) as unknown as number
}

export const serverTimestamp = () => {
	return firestore.FieldValue.serverTimestamp() as unknown as Firelord.ServerTimestampMasked
}

export const arrayUnion = <T>(...values: T[]) => {
	return firestore.FieldValue.arrayUnion(...values) as unknown as T[]
}

export const arrayRemove = <T>(...values: T[]) => {
	return firestore.FieldValue.arrayRemove(...values) as unknown as T[]
}
