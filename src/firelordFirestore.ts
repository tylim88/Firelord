export namespace FirelordFirestore {
	export type Firestore = typeof import('firebase-admin').firestore

	export type FieldValue = import('firebase-admin').firestore.FieldValue

	export type DocumentData = import('firebase-admin').firestore.DocumentData

	export type DocumentReference<T = FirebaseFirestore.DocumentData> =
		import('firebase-admin').firestore.DocumentReference<T>

	export type CollectionReference<T = FirebaseFirestore.DocumentData> =
		import('firebase-admin').firestore.CollectionReference<T>

	export type CollectionGroup<T = FirebaseFirestore.DocumentData> =
		import('firebase-admin').firestore.CollectionGroup<T>

	export type Query<T = FirebaseFirestore.DocumentData> =
		import('firebase-admin').firestore.Query<T>

	export type DocumentSnapshot<T = FirebaseFirestore.DocumentData> =
		import('firebase-admin').firestore.DocumentSnapshot<T>

	export type Transaction = import('firebase-admin').firestore.Transaction

	export type ReadOptions = import('firebase-admin').firestore.ReadOptions

	export type WriteBatch = import('firebase-admin').firestore.WriteBatch

	export type WhereFilterOp = FirebaseFirestore.WhereFilterOp

	export type OrderByDirection = FirebaseFirestore.OrderByDirection

	export type GeoPoint = Firestore['GeoPoint']

	export type CreatedUpdatedWrite = {
		createdAt: FieldValue
		updatedAt: FieldValue
	}
	export type CreatedUpdatedRead = {
		createdAt: Timestamp
		updatedAt: Timestamp
	}
	export type CreatedUpdatedCompare = {
		createdAt: Date | Timestamp
		updatedAt: Date | Timestamp
	}

	export type Timestamp = import('firebase-admin').firestore.Timestamp
}
