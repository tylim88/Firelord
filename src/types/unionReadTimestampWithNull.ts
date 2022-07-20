import { MetaType } from './metaTypeCreator'
import { ServerTimestamp } from './fieldValue'
import { ObjectFlattenRead } from './objectFlatten'

export type RecursiveUnionReadServerTimestampWithNull<T, Read> =
	T extends ServerTimestamp
		? Read | null
		: T extends Record<string, unknown>
		? Read extends Record<string, unknown>
			? {
					[K in keyof T &
						keyof Read]: RecursiveUnionReadServerTimestampWithNull<
						T[K],
						Read[K]
					>
			  }
			: never // impossible route
		: Read

export type UnionReadServerTimestampWithNull<T extends MetaType> =
	RecursiveUnionReadServerTimestampWithNull<T['write'], T['read']>

export type UnionReadServerTimestampWithNullFlatten<T extends MetaType> =
	RecursiveUnionReadServerTimestampWithNull<
		T['writeFlatten'],
		ObjectFlattenRead<T['read']>
	>
