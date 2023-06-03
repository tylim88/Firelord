import { OriFieldValue } from './alias'
import { ErrorArrayFieldValueEmpty } from './error'

declare const serverTimestampSymbol: unique symbol
declare const deleteFieldSymbol: unique symbol
declare const incrementSymbol: unique symbol
declare const possiblyReadAsUndefinedSymbol: unique symbol
declare const arraySymbol: unique symbol

export type ServerTimestampSymbol = typeof serverTimestampSymbol
export type DeleteFieldSymbol = typeof deleteFieldSymbol
export type IncrementSymbol = typeof incrementSymbol
export type PossiblyReadAsUndefinedSymbol = typeof possiblyReadAsUndefinedSymbol
export type ArraySymbol = typeof arraySymbol

export declare class FieldValue<T> {
	protected constructor()
	protected 'Firelord.FieldValue'?: T
}
interface ArrayFieldValue<T> {
	'Do_Not_Access.Firelord_ArrayFieldValue'?: T
}

export type ArrayRemoveOrUnion = <Elements extends unknown[]>(
	...elements: Elements extends [] ? [ErrorArrayFieldValueEmpty] : Elements
) => ArrayUnionOrRemove<Elements[number]>

// PossiblyReadAsUndefined is firelord Field Value dedicated for Read type, do not union it with FieldValues
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PossiblyReadAsUndefined
	extends FieldValue<PossiblyReadAsUndefinedSymbol> {}

export interface ServerTimestamp
	extends OriFieldValue,
		FieldValue<ServerTimestampSymbol> {}

// deleteField must appear at the top level of the data
export interface DeleteField
	extends OriFieldValue,
		FieldValue<DeleteFieldSymbol> {}

export interface Increment extends OriFieldValue, FieldValue<IncrementSymbol> {}
export interface ArrayUnionOrRemove<T>
	extends OriFieldValue,
		FieldValue<ArraySymbol>,
		ArrayFieldValue<T> {}

export type UnassignedAbleFieldValue = Increment | ArrayUnionOrRemove<unknown>

export type FieldValues =
	| ServerTimestamp
	| UnassignedAbleFieldValue
	| DeleteField