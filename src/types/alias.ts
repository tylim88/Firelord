export type Firestore = ReturnType<FirebaseFirestore['getFirestore']> // ! OriFirebaseFirestore['Firestore'] doesn't work even though they are the exact same type???

export type FirebaseFirestore = typeof import('firebase-admin/firestore')

export type DocumentData = import('firebase-admin/firestore').DocumentData

export type SetOptions = import('firebase-admin/firestore').SetOptions

export type Unsubscribe = ReturnType<
	import('firebase-admin/firestore').CollectionReference['onSnapshot']
>

export type DocumentChangeType =
	import('firebase-admin/firestore').DocumentChangeType

export type OrderByDirection =
	import('firebase-admin/firestore').OrderByDirection

export type WhereFilterOp = import('firebase-admin/firestore').WhereFilterOp

export type GeoPoint = FirebaseFirestore['GeoPoint']

export type Timestamp = import('firebase-admin/firestore').Timestamp

export type Precondition = import('firebase-admin/firestore').Precondition

export type WriteResult = import('firebase-admin/firestore').WriteResult

export type ReadOption = import('firebase-admin/firestore').ReadOptions

export type OriDocumentReference<T extends DocumentData = DocumentData> =
	import('firebase-admin/firestore').DocumentReference<T>

export type OriCollectionReference<T extends DocumentData = DocumentData> =
	import('firebase-admin/firestore').CollectionReference<T>

export type OriQuery<T extends DocumentData = DocumentData> =
	import('firebase-admin/firestore').Query<T>

export type OriQuerySnapshot<T = DocumentData> =
	import('firebase-admin/firestore').QuerySnapshot<T>

export type OriQueryDocumentSnapshot<T = DocumentData> =
	import('firebase-admin/firestore').QueryDocumentSnapshot<T>

export type OriDocumentSnapshot<T extends DocumentData = DocumentData> =
	import('firebase-admin/firestore').DocumentSnapshot<T>

export type OriDocumentChange<T = DocumentData> =
	import('firebase-admin/firestore').DocumentChange<T>

export type OriFieldValue = import('firebase-admin/firestore').FieldValue

export type OriWriteBatch = import('firebase-admin/firestore').WriteBatch

export type OriTransaction = import('firebase-admin/firestore').Transaction
