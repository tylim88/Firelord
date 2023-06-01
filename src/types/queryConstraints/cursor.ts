import { MetaType } from '../metaTypeCreator'
import {
	ErrorMoreThanOnceDocSnapshotInCursor,
	ErrorEmptyCursor,
	ErrorCursorNoArray,
} from '../error'
import { DocumentSnapshot, QueryDocumentSnapshot } from '../snapshot'

export type CursorType = 'startAt' | 'startAfter' | 'endAt' | 'endBefore'

export type CursorConstraint<
	Type extends CursorType,
	Values extends unknown[]
> = {
	type: Type
	values: Values
}

export type Cursor<Type extends CursorType> = <const Values extends unknown[]>(
	...snapshotOrFieldValues: Values['length'] extends 0
		? [ErrorEmptyCursor]
		: number extends Values['length']
		? [ErrorCursorNoArray]
		: Values extends (infer R)[]
		? // TODO add this ruling to doc
		  DocumentSnapshot<MetaType> extends R // ! why R extends DocumentSnapshot<MetaType> mess up date type?
			? Values['length'] extends 1
				? Values
				: ErrorMoreThanOnceDocSnapshotInCursor[] // ! if this change to [ErrorMoreThanOnceDocSnapshotInCursor], it will not able to infer as literal type, why?
			: QueryDocumentSnapshot<MetaType> extends R
			? Values['length'] extends 1
				? Values
				: ErrorMoreThanOnceDocSnapshotInCursor[]
			: Values
		: Values
) => CursorConstraint<Type, Values>
