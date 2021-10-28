import { OmitKeys, ExcludePropertyKeys, RemoveArray } from './firelord'
import { FirelordFirestore } from './firelordFirestore'

// https://stackoverflow.com/questions/69724861/recursive-type-become-any-after-emit-declaration-need-implicit-solution

export type QueryCreator<
	Read extends FirelordFirestore.DocumentData &
		FirelordFirestore.CreatedUpdatedRead,
	Compare extends FirelordFirestore.DocumentData &
		FirelordFirestore.CreatedUpdatedCompare,
	WithoutArrayTypeMember extends ExcludePropertyKeys<Compare, unknown[]>,
	PermanentlyOmittedKeys extends keyof ReturnType<
		QueryCreator<Read, Compare, WithoutArrayTypeMember, PermanentlyOmittedKeys>
	> = never
> = (query: FirelordFirestore.Query<Read>) => {
	firestore: typeof query.firestore
	stream: typeof query.stream
	offset: (
		offset: number
	) => OmitKeys<
		ReturnType<
			QueryCreator<
				Read,
				Compare,
				WithoutArrayTypeMember,
				'offset' | PermanentlyOmittedKeys
			>
		>,
		'offset' | PermanentlyOmittedKeys
	>
	where: <
		P extends string & keyof Read,
		J extends FirelordFirestore.WhereFilterOp,
		Q extends WithoutArrayTypeMember
	>(
		fieldPath: P,
		opStr: J extends never
			? J
			: Compare[P] extends unknown[]
			? 'array-contains' | 'in' | 'array-contains-any'
			: '<' | '<=' | '>=' | '>' | '==' | '!=' | 'not-in' | 'in',
		value: J extends 'not-in' | 'in'
			? Compare[P][]
			: J extends 'array-contains'
			? RemoveArray<Compare[P]>
			: Compare[P],
		orderBy?: J extends '<' | '<=' | '>=' | '>' | '==' | 'in' | '!=' | 'not-in'
			? P extends WithoutArrayTypeMember
				? {
						fieldPath: Q extends never
							? Q
							: J extends '<' | '<=' | '>=' | '>'
							? Q extends P
								? WithoutArrayTypeMember
								: never
							: J extends '==' | 'in'
							? Q extends P
								? never
								: WithoutArrayTypeMember
							: J extends 'not-in' | '!='
							? WithoutArrayTypeMember
							: never
						directionStr?: FirelordFirestore.OrderByDirection
						cursor?: {
							clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
							fieldValue:
								| Compare[J extends 'not-in' | '!=' ? Q : P]
								| FirelordFirestore.DocumentSnapshot
						}
				  }
				: never
			: never
	) => J extends '<' | '<=' | '>' | '>' | '==' | 'in'
		? OmitKeys<
				ReturnType<
					QueryCreator<
						Read,
						Compare,
						WithoutArrayTypeMember,
						PermanentlyOmittedKeys
					>
				>,
				'orderBy' | PermanentlyOmittedKeys
		  >
		: OmitKeys<
				ReturnType<
					QueryCreator<
						Read,
						Compare,
						WithoutArrayTypeMember,
						PermanentlyOmittedKeys
					>
				>,
				PermanentlyOmittedKeys
		  >
	limit: (
		limit: number
	) => OmitKeys<
		ReturnType<
			QueryCreator<
				Read,
				Compare,
				WithoutArrayTypeMember,
				'limit' | 'limitToLast' | PermanentlyOmittedKeys
			>
		>,
		'limit' | 'limitToLast' | PermanentlyOmittedKeys
	>
	limitToLast: (
		limit: number
	) => OmitKeys<
		ReturnType<
			QueryCreator<
				Read,
				Compare,
				WithoutArrayTypeMember,
				'limit' | 'limitToLast' | PermanentlyOmittedKeys
			>
		>,
		'limit' | 'limitToLast' | PermanentlyOmittedKeys
	>
	orderBy: <P extends WithoutArrayTypeMember>(
		fieldPath: P,
		directionStr: FirelordFirestore.OrderByDirection,
		cursor?: {
			clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
			fieldValue: Compare[P] | FirelordFirestore.DocumentSnapshot
		}
	) => OmitKeys<
		ReturnType<
			QueryCreator<
				Read,
				Compare,
				WithoutArrayTypeMember,
				PermanentlyOmittedKeys
			>
		>,
		PermanentlyOmittedKeys
	>
	get: () => ReturnType<typeof query.get>
}

// need to make generic mandatory https://stackoverflow.com/questions/55610260/how-to-make-generics-mandatory
// however due to this is a recursive function, it is not possible
// luckily this is only used in 2 places and is explicitly typed, so everything is good
export const queryCreator = <
	Read extends FirelordFirestore.DocumentData &
		FirelordFirestore.CreatedUpdatedRead,
	Compare extends FirelordFirestore.DocumentData &
		FirelordFirestore.CreatedUpdatedCompare,
	WithoutArrayTypeMember extends ExcludePropertyKeys<Compare, unknown[]>,
	PermanentlyOmittedKeys extends keyof ReturnType<
		QueryCreator<Read, Compare, WithoutArrayTypeMember, PermanentlyOmittedKeys>
	> = never
>(
	query: FirelordFirestore.Query<Read>
): ReturnType<QueryCreator<Read, Compare, WithoutArrayTypeMember>> => {
	const orderByCreator =
		(query: FirelordFirestore.Query<Read>) =>
		<P extends WithoutArrayTypeMember>(
			fieldPath: P,
			directionStr: FirelordFirestore.OrderByDirection = 'asc',
			cursor?: {
				clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
				fieldValue: Compare[P] | FirelordFirestore.DocumentSnapshot
			}
		) => {
			const ref = query.orderBy(fieldPath, directionStr)

			return queryCreator<
				Read,
				Compare,
				WithoutArrayTypeMember,
				PermanentlyOmittedKeys
			>(cursor ? ref[cursor.clause](cursor.fieldValue) : ref)
		}

	return {
		firestore: query.firestore,
		stream: () => {
			return query.stream()
		},
		offset: (offset: number) => {
			return queryCreator<
				Read,
				Compare,
				WithoutArrayTypeMember,
				PermanentlyOmittedKeys
			>(query.offset(offset))
		},
		where: <
			P extends string & keyof Read,
			J extends FirelordFirestore.WhereFilterOp,
			Q extends WithoutArrayTypeMember
		>(
			fieldPath: P,
			opStr: J extends never
				? J
				: Compare[P] extends unknown[]
				? 'array-contains' | 'in' | 'array-contains-any'
				: '<' | '<=' | '>=' | '>' | '==' | '!=' | 'not-in' | 'in',
			value: J extends 'not-in' | 'in'
				? Compare[P][]
				: J extends 'array-contains'
				? RemoveArray<Compare[P]>
				: Compare[P],
			orderBy?: J extends
				| '<'
				| '<='
				| '>='
				| '>'
				| '=='
				| 'in'
				| '!='
				| 'not-in'
				? P extends WithoutArrayTypeMember
					? {
							fieldPath: Q extends never
								? Q
								: J extends '<' | '<=' | '>=' | '>'
								? Q extends P
									? WithoutArrayTypeMember
									: never
								: J extends '==' | 'in'
								? Q extends P
									? never
									: WithoutArrayTypeMember
								: J extends 'not-in' | '!='
								? WithoutArrayTypeMember
								: never
							directionStr?: FirelordFirestore.OrderByDirection
							cursor?: {
								clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
								fieldValue:
									| Compare[J extends 'not-in' | '!=' ? Q : P]
									| FirelordFirestore.DocumentSnapshot
							}
					  }
					: never
				: never
		) => {
			const ref = query.where(fieldPath, opStr, value)

			const queryRef = queryCreator<
				Read,
				Compare,
				WithoutArrayTypeMember,
				PermanentlyOmittedKeys
			>(ref)

			const { orderBy: orderBy1, ...rest } = orderBy
				? orderByCreator(ref)(
						orderBy.fieldPath,
						orderBy.directionStr,
						orderBy.cursor
				  )
				: queryRef

			return (orderBy ? rest : queryRef) as J extends
				| '<'
				| '<='
				| '>'
				| '>'
				| '=='
				| 'in'
				? typeof rest
				: typeof queryRef
		},
		limit: (limit: number) => {
			return queryCreator<
				Read,
				Compare,
				WithoutArrayTypeMember,
				PermanentlyOmittedKeys
			>(query.limit(limit))
		},
		limitToLast: (limit: number) => {
			return queryCreator<
				Read,
				Compare,
				WithoutArrayTypeMember,
				PermanentlyOmittedKeys
			>(query.limitToLast(limit))
		},
		orderBy: orderByCreator(query),
		get: () => {
			return query.get()
		},
	}
}