import { MetaType, GetAllCompareKeys } from '../metaTypeCreator'
import { OrderByDirection } from '../alias'
import { ErrorCursorTooManyArguments } from '../error'
import {
	QueryConstraints,
	OrderByConstraint,
	CursorConstraint,
	CursorType,
} from '../queryConstraints'
import { __name__, GetCorrectDocumentIdBasedOnRef } from '../fieldPath'
import { QueryDocumentSnapshot, DocumentSnapshot } from '../snapshot'
import { GetAllOrderBy } from './orderBy'
import { Query } from '../refs'
import { DeepValue } from '../objectFlatten'

// Too many arguments provided to startAt(). The number of arguments must be less than or equal to the number of orderBy() clauses
type ValidateCursorOrderBy<
	T extends MetaType,
	Q extends Query<T>,
	Values extends unknown[],
	AllOrderBy extends OrderByConstraint<
		T,
		GetAllCompareKeys<T>,
		OrderByDirection | undefined
	>[]
> = Values extends [infer Head, ...infer Rest]
	? AllOrderBy extends [infer H, ...infer R]
		? H extends OrderByConstraint<
				T,
				GetAllCompareKeys<T>,
				OrderByDirection | undefined
		  >
			? [
					H['fieldPath'] extends __name__
						? GetCorrectDocumentIdBasedOnRef<T, Q, H['fieldPath'], Head>
						: Head extends
								| DeepValue<T['compare'], H['fieldPath']>
								| QueryDocumentSnapshot<T>
								| DocumentSnapshot<T>
						? Head | QueryDocumentSnapshot<T> | DocumentSnapshot<T>
						:
								| DeepValue<T['compare'], H['fieldPath']>
								| QueryDocumentSnapshot<T>
								| DocumentSnapshot<T>,
					...ValidateCursorOrderBy<
						T,
						Q,
						Rest,
						R extends OrderByConstraint<
							T,
							GetAllCompareKeys<T>,
							OrderByDirection | undefined
						>[]
							? R
							: []
					>
			  ]
			: never // impossible route
		: [ErrorCursorTooManyArguments]
	: [] // end, Rest is []

export type CursorConstraintLimitation<
	T extends MetaType,
	Q extends Query<T>,
	U extends CursorConstraint<CursorType, unknown[]>,
	PreviousQCs extends QueryConstraints<T>[]
> = CursorConstraint<
	CursorType,
	ValidateCursorOrderBy<T, Q, U['values'], GetAllOrderBy<T, PreviousQCs, []>>
>
