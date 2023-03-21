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

/**
 * An immutable object representing a geo point in Firestore. The geo point is represented as latitude/longitude pair.
 *
 * Latitude values are in the range of [-90, 90]. Longitude values are in the range of [-180, 180].
 */
export type GeoPoint = FirebaseFirestore['GeoPoint']

/**
 * A Timestamp represents a point in time independent of any time zone or
 * calendar, represented as seconds and fractions of seconds at nanosecond
 * resolution in UTC Epoch time. It is encoded using the Proleptic Gregorian
 * Calendar which extends the Gregorian calendar backwards to year one. It is
 * encoded assuming all minutes are 60 seconds long, i.e. leap seconds are
 * "smeared" so that no leap second table is needed for interpretation. Range
 * is from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59.999999999Z.
 *
 * @see https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto
 */
export type Timestamp = import('firebase-admin/firestore').Timestamp

export type Precondition = import('firebase-admin/firestore').Precondition

export type WriteResult = import('firebase-admin/firestore').WriteResult

export type ReadOption = import('firebase-admin/firestore').ReadOptions

export type ReadOnlyTransactionOptions =
	import('firebase-admin/firestore').ReadOnlyTransactionOptions

export type ReadWriteTransactionOptions =
	import('@google-cloud/firestore').ReadWriteTransactionOptions

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

export declare class Bytes {
	private constructor()
	/**
	 * Creates a new `Bytes` object from the given Base64 string, converting it to
	 * bytes.
	 *
	 * @param base64 - The Base64 string used to create the `Bytes` object.
	 */
	static fromBase64String(base64: string): Bytes
	/**
	 * Creates a new `Bytes` object from the given Uint8Array.
	 *
	 * @param array - The Uint8Array used to create the `Bytes` object.
	 */
	static fromUint8Array(array: Uint8Array): Bytes
	/**
	 * Returns the underlying bytes as a Base64-encoded string.
	 *
	 * @returns The Base64-encoded string created from the `Bytes` object.
	 */
	toBase64(): string
	/**
	 * Returns the underlying bytes in a new `Uint8Array`.
	 *
	 * @returns The Uint8Array created from the `Bytes` object.
	 */
	toUint8Array(): Uint8Array
	/**
	 * Returns a string representation of the `Bytes` object.
	 *
	 * @returns A string representation of the `Bytes` object.
	 */
	toString(): string
	/**
	 * Returns true if this `Bytes` object is equal to the provided one.
	 *
	 * @param other - The `Bytes` object to compare against.
	 * @returns true if this `Bytes` object is equal to the provided one.
	 */
	isEqual(other: Bytes): boolean
}
