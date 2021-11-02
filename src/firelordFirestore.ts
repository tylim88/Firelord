export namespace FirelordFirestore {
	export type Firestore = typeof import('firebase-admin').firestore

	export type FirebaseFirestore = FirebaseFirestore.Firestore

	export type FieldValue = FirebaseFirestore.FieldValue

	export type DocumentData = FirebaseFirestore.DocumentData

	export type DocumentChange<T = DocumentData> =
		FirebaseFirestore.DocumentChange<T>

	export type DocumentReference<T = DocumentData> =
		FirebaseFirestore.DocumentReference<T>

	export type CollectionReference<T = DocumentData> =
		FirebaseFirestore.CollectionReference<T>

	export type CollectionGroup<T = DocumentData> =
		FirebaseFirestore.CollectionGroup<T>

	export type Query<T = DocumentData> = FirebaseFirestore.Query<T>

	export type QuerySnapshot<T = DocumentData> =
		FirebaseFirestore.QuerySnapshot<T>

	export type QueryDocumentSnapshot<T = DocumentData> =
		FirebaseFirestore.QueryDocumentSnapshot<T>

	export type DocumentSnapshot<T = DocumentData> =
		FirebaseFirestore.DocumentSnapshot<T>

	export type Transaction = FirebaseFirestore.Transaction

	export type ReadOptions = FirebaseFirestore.ReadOptions

	export type WriteBatch = FirebaseFirestore.WriteBatch

	export type WriteResult = FirebaseFirestore.WriteResult

	export type WhereFilterOp = FirebaseFirestore.WhereFilterOp

	export type OrderByDirection = FirebaseFirestore.OrderByDirection

	export type GeoPoint = Firestore['GeoPoint']

	export type Timestamp = FirebaseFirestore.Timestamp

	export type Stream = NodeJS.ReadableStream

	export type ReadWriteTransactionOptions =
		FirebaseFirestore.ReadWriteTransactionOptions

	export type ReadOnlyTransactionOptions =
		FirebaseFirestore.ReadOnlyTransactionOptions
}

export { firestore } from 'firebase-admin'
