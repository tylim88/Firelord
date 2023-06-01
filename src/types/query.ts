import { MetaType } from './metaTypeCreator'
import { QueryConstraints } from './queryConstraints'
import { QueryConstraintLimitation } from './queryConstraintsLimitations'
import { Query, CollectionReference } from './refs'

export type QueryRef = <
	T extends MetaType,
	Q extends Query<T> | CollectionReference<T>,
	QC extends QueryConstraints<T>[]
>(
	query: Q extends never ? Q : Query<T> | CollectionReference<T>,

	...queryConstraints: QC extends never
		? QC
		: QueryConstraintLimitation<
				T extends T ? T : T, // ! I seriously don't understand why this is needed or else error, why we cant just T?
				Q,
				QC,
				[],
				QC
		  >
) => Query<T>
