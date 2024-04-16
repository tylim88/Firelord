import { MetaType } from '../metaTypeCreator'
import { ErrorWhereOrderByEquality } from '../error'
import {
	QueryConstraints,
	WhereConstraint,
	OrderByConstraint,
} from '../queryConstraints'
import { GetAllWhereConstraint } from './where'
import { In, Equal } from './utils'

// You can't order your query by a field included in an equality (==) or (in) clause.
export type ValidateOrderByEqualityWhere<
	T extends MetaType,
	U extends OrderByConstraint<string>,
	AllQCs extends QueryConstraints[]
> = Extract<
	GetAllWhereConstraint<T, AllQCs, never>,
	WhereConstraint<U['fieldPath'], In | Equal, unknown>
> extends never
	? true
	: false

export type OrderByConstraintLimitation<
	T extends MetaType,
	U extends OrderByConstraint<string>,
	AllQCs extends QueryConstraints[]
> = ValidateOrderByEqualityWhere<T, U, AllQCs> extends false
	? ErrorWhereOrderByEquality
	: U

export type GetFirstOrderBy<
	T extends MetaType,
	QCs extends QueryConstraints[]
> = QCs extends [infer H, ...infer Rest]
	? H extends OrderByConstraint<string>
		? H
		: Rest extends QueryConstraints[]
		? GetFirstOrderBy<T, Rest>
		: never // impossible route
	: true // not found, no check needed

export type GetAllOrderBy<
	T extends MetaType,
	QCs extends QueryConstraints[],
	AllOrderBy extends OrderByConstraint<string>[]
> = QCs extends [infer H, ...infer Rest]
	? Rest extends QueryConstraints[]
		? GetAllOrderBy<
				T,
				Rest,
				H extends OrderByConstraint<string> ? [...AllOrderBy, H] : AllOrderBy
		  >
		: [] // impossible route
	: AllOrderBy // not found, no check needed
