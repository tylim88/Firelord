export type OriFirestore = ReturnType<OriFirebaseFirestore['getFirestore']> // ! OriFirebaseFirestore['Firestore'] doesn't work even though they are the exact same type???

export type OriFirebaseFirestore = typeof import('firebase-admin/firestore')

export type OriDocumentData = import('firebase-admin/firestore').DocumentData

export type OriSetOptions = import('firebase-admin/firestore').SetOptions

export type OriUnsubscribe = ReturnType<
	import('firebase-admin/firestore').CollectionReference['onSnapshot']
>

export type OriDocumentReference<T extends OriDocumentData = OriDocumentData> =
	import('firebase-admin/firestore').DocumentReference<T>

export type OriCollectionReference<
	T extends OriDocumentData = OriDocumentData
> = import('firebase-admin/firestore').CollectionReference<T>

export type OriQuery<T extends OriDocumentData = OriDocumentData> =
	import('firebase-admin/firestore').Query<T>

export type OriQuerySnapshot<T = OriDocumentData> =
	import('firebase-admin/firestore').QuerySnapshot<T>

export type OriQueryDocumentSnapshot<T = OriDocumentData> =
	import('firebase-admin/firestore').QueryDocumentSnapshot<T>

export type OriDocumentSnapshot<T extends OriDocumentData = OriDocumentData> =
	import('firebase-admin/firestore').DocumentSnapshot<T>

export type OriDocumentChange<T = OriDocumentData> =
	import('firebase-admin/firestore').DocumentChange<T>

export type OriDocumentChangeType =
	import('firebase-admin/firestore').DocumentChangeType

export type OriWriteBatch = import('firebase-admin/firestore').WriteBatch

export type OriTransaction = import('firebase-admin/firestore').Transaction

export type OriOrderByDirection = 'asc' | 'desc'

export type OriWhereFilterOp = import('firebase-admin/firestore').WhereFilterOp

export type OriGeoPoint = OriFirebaseFirestore['GeoPoint']

export type OriTimestamp = import('firebase-admin/firestore').Timestamp

export type OriFieldValue = import('firebase-admin/firestore').FieldValue

export type OriPrecondition = import('firebase-admin/firestore').Precondition

export type OriWriteResult = import('firebase-admin/firestore').WriteResult

export type OriReadOption = import('firebase-admin/firestore').ReadOptions
