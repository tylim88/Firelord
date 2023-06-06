import { Timestamp, Bytes, GeoPoint } from '../alias'
import {
	ErrorFieldValueInArray,
	ErrorUnassignedAbleFieldValue,
	NoUndefinedAndBannedTypes,
	NoDirectNestedArray,
} from '../error'
import {
	FieldValues,
	UnassignedAbleFieldValue,
	DeleteField,
	ServerTimestamp,
	PossiblyReadAsUndefined,
} from '../fieldValues'
import { DeepValue } from '../objectFlatten'
import { DocumentReference } from '../refs'
import { MetaType } from './metaType'

type CompareConverterArray<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		? readonly CompareConverterArray<A, BannedTypes>[]
		: T extends Bytes
		? T
		: T extends FieldValues
		? ErrorFieldValueInArray
		: T extends Date | Timestamp
		? Timestamp | Date
		: T extends DocumentReference<MetaType> | GeoPoint
		? T
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: CompareConverterArray<T[K], BannedTypes>
		  }
		: T extends PossiblyReadAsUndefined
		? never
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>

export type CompareConverter<T, BannedTypes> = NoDirectNestedArray<
	T,
	T extends (infer A)[]
		? readonly CompareConverterArray<A, BannedTypes>[]
		: T extends Bytes
		? T
		: T extends ServerTimestamp | Date | Timestamp
		? Timestamp | Date
		: T extends DocumentReference<MetaType> | GeoPoint
		? T
		: T extends Record<string, unknown>
		? {
				[K in keyof T]-?: CompareConverter<
					DeepValue<T, K & string>,
					BannedTypes
				>
		  }
		: T extends PossiblyReadAsUndefined | DeleteField
		? never
		: T extends UnassignedAbleFieldValue
		? ErrorUnassignedAbleFieldValue
		: NoUndefinedAndBannedTypes<T, BannedTypes>
>
