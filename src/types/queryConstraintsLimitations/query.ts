import { MetaType } from '../metaTypeCreator'
import { WhereFilterOp } from '../alias'
import {
	QueryConstraints,
	WhereConstraint,
	OrderByConstraint,
	CursorConstraint,
	LimitConstraint,
	OffsetConstraint,
	CursorType,
} from '../queryConstraints'
import { GeneralQuery } from '../refs'
import { LimitToLastConstraintLimitation } from './limit'
import { CursorConstraintLimitation } from './cursor'
import { OrderByConstraintLimitation, GetFirstOrderBy } from './orderBy'
import { GetFirstInequalityWhere, WhereConstraintLimitation } from './where'
import { InequalityOpStr } from './utils'
import { IsSame } from '../utils'
import { ErrorWhereOrderByAndInEquality } from '../error'

// If you include a filter with a range comparison (<, <=, >, >=), your first ordering must be on the same field
export type ValidateOrderByAndInequalityWhere<
	T extends MetaType,
	AllQCs extends QueryConstraints[]
> = GetFirstInequalityWhere<T, AllQCs> extends infer W
	? W extends WhereConstraint<string, InequalityOpStr, unknown>
		? GetFirstOrderBy<T, AllQCs> extends infer O
			? O extends OrderByConstraint<string>
				? IsSame<W['fieldPath'], O['fieldPath']> extends true
					? true
					: ErrorWhereOrderByAndInEquality<O['fieldPath'], W['fieldPath']>
				: true // orderBy not found
			: never // impossible route
		: true // inequality Where not found
	: never // impossible route

export type QueryConstraintLimitation<
	T extends MetaType,
	Q extends GeneralQuery<T>,
	RestQCs extends QueryConstraints[],
	PreviousQCs extends QueryConstraints[],
	AllQCs extends QueryConstraints[]
> = ValidateOrderByAndInequalityWhere<T, AllQCs> extends string
	? ValidateOrderByAndInequalityWhere<T, AllQCs>[]
	: RestQCs extends [infer Head, ...infer Rest]
	? Rest extends QueryConstraints[]
		? [
				Head extends LimitConstraint<'limit', number> | OffsetConstraint
					? Head
					: Head extends OrderByConstraint<string>
					? OrderByConstraintLimitation<T, Head, AllQCs>
					: Head extends LimitConstraint<'limitToLast', number>
					? LimitToLastConstraintLimitation<T, Head, AllQCs>
					: Head extends WhereConstraint<string, WhereFilterOp, unknown>
					? WhereConstraintLimitation<T, Q, Head, PreviousQCs>
					: Head extends CursorConstraint<CursorType, unknown[]>
					? CursorConstraintLimitation<T, Q, Head, PreviousQCs>
					: never, // impossible route
				...QueryConstraintLimitation<
					T,
					Q,
					Rest,
					Head extends QueryConstraints ? [...PreviousQCs, Head] : PreviousQCs, // impossible route
					AllQCs
				>
		  ]
		: never[] // impossible route
	: RestQCs // basically mean RestQCs is []
