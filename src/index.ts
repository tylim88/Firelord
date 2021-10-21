import { firestore } from 'firebase-admin'
import {
	OmitKeys,
	PartialNoImplicitUndefined,
	ExcludePropertyKeys,
	RemoveArray,
} from './firelord'

export const fireLord = <
	T extends {
		ColPath: string
		DocPath: string
		read: firestore.DocumentData & Firestore.CreatedUpdatedRead
		write: firestore.DocumentData & Firestore.CreatedUpdatedWrite
		base: firestore.DocumentData
	} = never
>() => {
	type Write = OmitKeys<T['write'], 'updatedAt' | 'createdAt'>
	type Read = T['read']
	const colCreator = (
		col: (
			collectionPath: string
		) => firestore.CollectionReference<firestore.DocumentData>,
		query?: firestore.Query<Read>
	) => {
		return (collectionPath: T['ColPath']) => {
			const colRefWrite = col(
				collectionPath
			) as firestore.CollectionReference<Write>
			const colRefRead = colRefWrite as firestore.CollectionReference<Read>

			const doc = (documentPath: T['DocPath']) => {
				const docWrite = colRefWrite.doc(documentPath)

				const docRead = colRefRead.doc(documentPath)

				return {
					firestore: docRead.firestore,
					id: docRead.id,
					parent: docRead.parent,
					path: docRead.path,
					listCollections: () => {
						return docRead.listCollections()
					},
					isEqual: (
						other: firestore.DocumentReference<firestore.DocumentData>
					) => {
						return docRead.isEqual(other as firestore.DocumentReference<Read>)
					},
					onSnapshot: (
						next?: (snapshot: firestore.DocumentSnapshot<Read>) => void,
						error?: (error: Error) => void
					) => {
						return docRead.onSnapshot(
							snapshot => {
								return next && next(snapshot)
							},
							err => {
								return error && error(err)
							}
						)
					},
					create: (data: Write) => {
						const time = firestore.FieldValue.serverTimestamp()

						return docWrite.create({
							createdAt: time,
							updatedAt: time,
							...data,
						})
					},
					set: <
						J extends Partial<Write>,
						Z extends { merge?: true; mergeField?: (keyof Write)[] }
					>(
						data: J extends never
							? J
							: Z extends undefined
							? Write
							: Z['merge'] extends true
							? PartialNoImplicitUndefined<Write, J>
							: Z['mergeField'] extends (keyof Write)[]
							? PartialNoImplicitUndefined<Write, J>
							: Write,
						options?: Z
					) => {
						const time = firestore.FieldValue.serverTimestamp()
						if (options) {
							return docWrite.set(
								{
									updatedAt: time,
									...data,
								},
								options
							)
						} else {
							return docWrite.set({
								createdAt: time,
								updatedAt: time,
								...data,
							})
						}
					},
					update: <J extends Partial<Write>>(
						data: J extends never ? J : PartialNoImplicitUndefined<Write, J>
					) => {
						const time = firestore.FieldValue.serverTimestamp()

						return docWrite.update({
							updatedAt: time,
							...data,
						})
					},
					get: () => {
						return docRead.get()
					},
					delete: () => docWrite.delete(),
					batch: (batch: firestore.WriteBatch) => {
						return {
							commit: () => {
								return batch.commit()
							},
							delete: () => {
								return batch.delete(docWrite)
							},
							update: <J extends Partial<Write>>(
								data: J extends never ? J : PartialNoImplicitUndefined<Write, J>
							) => {
								const time = firestore.FieldValue.serverTimestamp()
								return batch.update(docWrite, { updatedAt: time, ...data })
							},
							create: (data: Write) => {
								const time = firestore.FieldValue.serverTimestamp()
								return batch.create(docWrite, {
									createdAt: time,
									updatedAt: time,
									...data,
								})
							},
						}
					},
				}
			}
			// https://github.com/microsoft/TypeScript/issues/32022
			// https://stackoverflow.com/questions/51591335/typescript-spead-operator-on-object-with-method

			const orderByCreator =
				(
					colRefRead: firestore.CollectionReference<Read>,
					query?: firestore.Query<Read>
				) =>
				<P extends ExcludePropertyKeys<Read, unknown[]>>(
					fieldPath: P,
					directionStr: FirebaseFirestore.OrderByDirection = 'asc',
					cursor?: {
						clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
						fieldValue: Read[P] | firestore.DocumentSnapshot
					}
				) => {
					const ref = (query || colRefRead).orderBy(fieldPath, directionStr)

					return colCreator(
						col,
						cursor ? ref[cursor.clause](cursor.fieldValue) : ref
					)
				}

			return {
				parent: colRefRead.parent,
				path: colRefRead.path,
				id: colRefRead.id,
				firestore: colRefRead.firestore,
				listDocuments: () => {
					return colRefRead.listDocuments()
				},
				stream: () => {
					return colRefRead.stream()
				},
				offset: (offset: number) => {
					return colCreator(col, (query || colRefRead).offset(offset))
				},
				doc,
				add: (data: Write) => {
					const time = firestore.FieldValue.serverTimestamp()

					return colRefWrite.add({
						createdAt: time,
						updatedAt: time,
						...data,
					})
				},
				where: <
					P extends string & keyof Read,
					J extends FirebaseFirestore.WhereFilterOp,
					Q extends ExcludePropertyKeys<Read, unknown[]>
				>(
					fieldPath: P,
					opStr: J extends never
						? J
						: Read[P] extends unknown[]
						? '<' | '<=' | '==' | '!=' | '>=' | '>' | 'not-in' | 'in'
						: 'array-contains' | 'in' | 'array-contains-any',
					value: J extends 'not-in' | 'in'
						? Read[P][]
						: J extends 'array-contains'
						? RemoveArray<Read[P]>
						: Read[P],
					orderBy?: J extends 'in' | '='
						? never
						: J extends '<' | '<=' | '>' | '>' | 'not-in'
						? P extends ExcludePropertyKeys<Read, unknown[]>
							? {
									fieldPath?: Q extends never
										? Q
										: J extends 'not-in'
										? ExcludePropertyKeys<Read, unknown[]>
										: never
									directionStr?: FirebaseFirestore.OrderByDirection
									cursor?: {
										clause: 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
										fieldValue: Read[J extends 'not-in' ? Q : P]
									}
							  }
							: never
						: never
				) => {
					const ref = (query || colRefRead).where(fieldPath, opStr, value)

					return orderBy
						? orderByCreator(colRefRead, ref)(
								orderBy.fieldPath ||
									(fieldPath as unknown as string &
										ExcludePropertyKeys<Read, unknown[]>),
								orderBy.directionStr,
								orderBy.cursor
						  )
						: colCreator(col, ref)
				},
				limit: (limit: number) => {
					return colCreator(col, (query || colRefRead).limit(limit))
				},
				limitToLast: (limit: number) => {
					return colCreator(col, (query || colRefRead).limitToLast(limit))
				},
				orderBy: orderByCreator(colRefRead),
				get: () => {
					return (query || colRefRead).get()
				},
			}
		}
	}

	return { col: colCreator(firestore().collection) }
}

export const ozai = fireLord
