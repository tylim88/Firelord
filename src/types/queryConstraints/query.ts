import { CursorType, CursorConstraint } from './cursor'
import { WhereConstraint } from './where'
import { WhereFilterOp, OrderByDirection } from '../alias'
import { LimitConstraint } from './limit'
import { MetaType, GetAllCompareKeys } from '../metaTypeCreator'
import { OrderByConstraint } from './orderBy'
import { OffsetConstraint } from './offset'

export type QueryConstraints<T extends MetaType> =
	| WhereConstraint<T, GetAllCompareKeys<T>, WhereFilterOp, unknown>
	| LimitConstraint<'limit' | 'limitToLast', number>
	| CursorConstraint<CursorType, unknown[]>
	| OrderByConstraint<T, GetAllCompareKeys<T>, OrderByDirection | undefined>
	| OffsetConstraint
