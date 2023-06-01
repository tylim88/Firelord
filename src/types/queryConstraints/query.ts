import { CursorType, CursorConstraint } from './cursor'
import { WhereConstraint } from './where'
import { WhereFilterOp, OrderByDirection } from '../alias'
import { LimitConstraint } from './limit'
import { MetaType } from '../metaTypeCreator'
import { OrderByConstraint } from './orderBy'
import { OffsetConstraint } from './offset'

export type QueryConstraints<T extends MetaType> =
	| WhereConstraint<T, keyof T['compare'] & string, WhereFilterOp, unknown>
	| LimitConstraint<'limit' | 'limitToLast', number>
	| CursorConstraint<CursorType, unknown[]>
	| OrderByConstraint<keyof T['compare'] & string, OrderByDirection | undefined>
	| OffsetConstraint
