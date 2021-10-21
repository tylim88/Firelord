type ObjectSelf<T> = { [key in keyof T]: T[key] }

export type OmitKeys<T, K extends keyof T> = Omit<T, K>

type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }

type Nullable<T> = { [K in keyof T]: T[K] | null }

export type RemoveArray<T extends unknown[]> = T extends infer A ? A : never

export type ExcludePropertyKeys<A, U = undefined> = string &
	{
		[P in keyof A]: A[P] extends U ? never : P
	}[keyof A]

export type NoUndefined<T> = {
	[K in keyof T]: T[K] extends undefined
		? 'value cannot be undefined, if this is intentional, please explicitly assign the undefined type in base type'
		: T[K]
}

type IncludeKeys<T, K extends keyof T> = { [Y in K]: T[Y] }

type DistributeUndefined<T, K> = T extends undefined
	? T
	: K extends undefined
	? 'value cannot be undefined'
	: K

export type PartialNoImplicitUndefined<
	L extends { [index: string]: unknown },
	T extends Partial<L>
> = IncludeKeys<
	{
		[K in keyof L]: DistributeUndefined<L[K], T[K]>
	},
	keyof L & keyof T
>

type ExcludeUnion<T, U extends T> = Exclude<T, U>

type NonNullableKey<T, K extends keyof T> = OmitKeys<T, K> &
	Required<{
		[index in K]: T[K]
	}>

export namespace FireLord {
	type ServerTimestamp = 'ServerTimestamp'

	type ReadConverter<T> = T extends ServerTimestamp | Date
		? Firestore.Timestamp
		: T extends (infer A)[]
		? A extends ServerTimestamp | Date
			? Firestore.Timestamp[]
			: T
		: T

	type WriteConverter<T> = T extends (infer A)[]
		?
				| (A extends ServerTimestamp
						? Firestore.FieldValue[]
						: A extends Firestore.Timestamp | Date
						? (Firestore.Timestamp | Date)[]
						: A[])
				| Firestore.FieldValue
		: T extends ServerTimestamp
		? Firestore.FieldValue
		: T extends Firestore.Timestamp | Date
		? Firestore.Timestamp | Date
		: T extends number
		? Firestore.FieldValue | number
		: T

	type ReadWriteCreator<
		B extends { [index: string]: unknown },
		C extends string,
		D extends string,
		E extends { ColPath: string; DocPath: string } = never
	> = {
		base: B
		read: {
			[J in keyof B]: ReadConverter<B[J]>
		} & Firestore.CreatedUpdatedRead
		write: {
			[J in keyof B]: WriteConverter<B[J]>
		} & Firestore.CreatedUpdatedWrite

		ColPath: E extends never ? C : `${E['ColPath']}\\${E['DocPath']}\\${C}`
		DocPath: D
	}
}
