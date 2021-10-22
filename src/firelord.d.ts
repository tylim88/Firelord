export type OmitKeys<T, K extends keyof T> = Omit<T, K>

export type RemoveArray<T extends unknown[]> = T extends (infer A)[] ? A : never

export type ExcludePropertyKeys<A, U = undefined> = string &
	{
		[P in keyof A]: A[P] extends U ? never : P
	}[keyof A]

type IncludeKeys<T, K extends keyof T> = { [Y in K]: T[Y] }

type DistributeNoUndefined<T, K> = T extends undefined
	? T
	: K extends undefined
	? 'value cannot be undefined, if this is intentional, please union undefined in base type'
	: K

export type PartialNoImplicitUndefined<
	L extends { [index: string]: unknown },
	T extends Partial<L>
> = IncludeKeys<
	{
		[K in keyof L]: DistributeNoUndefined<L[K], T[K]>
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

	// https://stackoverflow.com/questions/69628967/typescript-distribute-over-union-doesnt-work-in-index-signature

	type ArrayWriteConverter<A> = A extends (infer T)[]
		? ArrayWriteConverter<T>[]
		: A extends ServerTimestamp
		? Firelord.FieldValue
		: A extends Firelord.Timestamp | Date
		? Firelord.Timestamp | Date
		: A

	type ReadConverter<T> = T extends (infer A)[]
		? ReadConverter<A>[]
		: T extends ServerTimestamp | Date
		? Firelord.Timestamp
		: T

	type CompareConverter<A> = A extends (infer T)[]
		? CompareConverter<T>[]
		: A extends ServerTimestamp | Date | Firelord.Timestamp
		? Firelord.Timestamp | Date
		: A

	type WriteConverter<T> = T extends (infer A)[]
		? ArrayWriteConverter<A>[] | Firelord.FieldValue
		: T extends ServerTimestamp
		? Firelord.FieldValue
		: T extends Firelord.Timestamp | Date
		? Firelord.Timestamp | Date
		: T extends number
		? Firelord.FieldValue | number
		: T

	type ReadWriteCreator<
		B extends { [index: string]: unknown },
		C extends string,
		D extends string,
		E extends { colPath: string; docPath: string } = {
			colPath: never
			docPath: never
		}
	> = {
		base: B
		read: {
			[J in keyof B]: ReadConverter<B[J]>
		} & {
			[index in keyof Firelord.CreatedUpdatedRead]: Firelord.CreatedUpdatedRead[index]
		} // so it looks more explicit in typescript hint
		write: {
			[J in keyof B]: WriteConverter<B[J]>
		} & {
			[index in keyof Firelord.CreatedUpdatedWrite]: Firelord.CreatedUpdatedWrite[index]
		} // so it looks more explicit in typescript hint
		compare: {
			[J in keyof B]: CompareConverter<B[J]>
		} & {
			[index in keyof Firelord.CreatedUpdatedCompare]: Firelord.CreatedUpdatedCompare[index]
		} // so it looks more explicit in typescript hint

		colPath: E extends {
			colPath: never
			docPath: never
		}
			? C
			: `${E['colPath']}/${E['docPath']}/${C}`
		docPath: D
	}

	type a = ReadWriteCreator<
		{
			a:
				| string
				| Date
				| number[]
				| (string | number)[]
				| (string | Date)[][]
				| (string | number)[][][]
		},
		string,
		string
	>

	type b = a['write']
	type c = a['read']
	type f = a['compare']

	type d = string[] & (string | number)[]
}
