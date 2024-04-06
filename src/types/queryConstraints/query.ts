import { CursorType, CursorConstraint } from './cursor'
import { WhereConstraint } from './where'
import { WhereFilterOp, OrderByDirection } from '../alias'
import { LimitConstraint } from './limit'
import { OrderByConstraint } from './orderBy'
import { OffsetConstraint } from './offset'

export type QueryConstraints =
	| WhereConstraint<string, WhereFilterOp, unknown>
	| LimitConstraint<'limit' | 'limitToLast', number>
	| CursorConstraint<CursorType, unknown[]>
	| OrderByConstraint<string, OrderByDirection | undefined>
	| OffsetConstraint
