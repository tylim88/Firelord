import {
	PartialNoImplicitUndefinedAndNoExtraMember,
	Firelord,
} from './firelord'
import { FirelordFirestore } from './firelordFirestore'
import { createTime } from './utils'

export const docSnapshotCreator = <
	T extends Firelord.MetaType,
	M extends 'col' | 'colGroup' = 'col'
>(
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference
		: M extends 'colGroup'
		? undefined
		: never,
	documentSnapshot: FirelordFirestore.DocumentSnapshot
): ReturnType<DocSnapshotCreator<T, M>> => {
	type Read = Firelord.InternalReadWriteConverter<T>['read']

	return {
		createTime: documentSnapshot.createTime,
		updateTime: documentSnapshot.updateTime,
		exists: documentSnapshot.exists,
		id: documentSnapshot.id,
		readTime: documentSnapshot.readTime,
		ref: docCreator<T, M>(
			firestore,
			colRef,
			documentSnapshot.ref
		)(documentSnapshot.ref.id),
		data: () => {
			return documentSnapshot.data() as T['read'] | undefined
		},
		get: <F extends string & keyof T['write']>(fieldPath: F) => {
			return documentSnapshot.get(fieldPath) as Read[F]
		},
		isEqual: (other: FirelordFirestore.DocumentSnapshot) => {
			return documentSnapshot.isEqual(
				other as FirelordFirestore.DocumentSnapshot<Read>
			)
		},
	}
}

export type DocSnapshotCreator<
	T extends Firelord.MetaType,
	M extends 'col' | 'colGroup' = 'col'
> = (
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference
		: M extends 'colGroup'
		? undefined
		: never,
	documentSnapshot: FirelordFirestore.DocumentSnapshot
) => {
	createTime?: FirelordFirestore.Timestamp
	updateTime?: FirelordFirestore.Timestamp
	exists: boolean
	id: string
	readTime: FirelordFirestore.Timestamp
	ref: ReturnType<ReturnType<DocCreator<T>>>
	data: () => T['read'] | undefined
	get: <F extends string & keyof T['write']>(fieldPath: F) => T['read'][F]
	isEqual: (other: FirelordFirestore.DocumentSnapshot) => boolean
}

export const docCreator =
	<T extends Firelord.MetaType, M extends 'col' | 'colGroup' = 'col'>(
		firestore: FirelordFirestore.Firestore,
		colRef: M extends 'col'
			? FirelordFirestore.CollectionReference
			: M extends 'colGroup'
			? undefined
			: never,
		docRef:
			| FirelordFirestore.DocumentReference
			| (M extends 'col' ? undefined : M extends 'colGroup' ? never : never)
	) =>
	(documentID?: T['docID']): ReturnType<ReturnType<DocCreator<T>>> => {
		type Write = Firelord.InternalReadWriteConverter<T>['write']
		type WriteNested = Firelord.InternalReadWriteConverter<T>['writeNested']
		type WriteNestedCreate =
			Firelord.InternalReadWriteConverter<T>['writeNestedCreate']
		type Read = Firelord.InternalReadWriteConverter<T>['read']

		const { createdAt, updatedAt } = createTime(firestore)

		// undefined type is here but we already make sure that it is impossible for undefined to reach here
		// if docRef is undefined, colRef will not be undefined and vice versa
		const docRef_ =
			docRef ||
			((colRef &&
				(documentID
					? colRef.doc(documentID)
					: colRef.doc())) as FirelordFirestore.DocumentReference)

		const docWrite = docRef_ as FirelordFirestore.DocumentReference<Write>

		const docRead = docRef_ as FirelordFirestore.DocumentReference<Read>

		return {
			firestore: docRead.firestore,
			id: docRead.id,
			parent: docRead.parent,
			path: docRead.path,
			listCollections: () => {
				return docRead.listCollections()
			},
			isEqual: (other: FirelordFirestore.DocumentReference) => {
				return docRead.isEqual(
					other as FirelordFirestore.DocumentReference<Read>
				)
			},
			onSnapshot: (
				next?: (snapshot: ReturnType<DocSnapshotCreator<T, M>>) => void,
				error?: (error: Error) => void
			) => {
				return docRead.onSnapshot(
					documentSnapshot => {
						return (
							next &&
							next(
								docSnapshotCreator<T, M>(firestore, colRef, documentSnapshot)
							)
						)
					},
					err => {
						return error && error(err)
					}
				)
			},
			create: (data: WriteNestedCreate) => {
				return docWrite.create({
					...createdAt,
					...data,
				})
			},
			set: <
				J extends Partial<WriteNested>,
				Z extends { merge?: true; mergeField?: (keyof Write)[] }
			>(
				data: J extends never
					? J
					: Z extends undefined
					? WriteNested
					: Z['merge'] extends true
					? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
					: Z['mergeField'] extends (keyof Write)[]
					? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
					: WriteNested,
				options?: Z
			) => {
				return docWrite.set(data, options || {})
			},
			update: <J extends Partial<Write>>(
				data: J extends never
					? J
					: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
			) => {
				return docWrite.update({
					...updatedAt,
					...data,
				})
			},
			get: () => {
				return docRead.get().then(documentSnapshot => {
					return docSnapshotCreator<T, M>(firestore, colRef, documentSnapshot)
				})
			},
			delete: () => docWrite.delete(),
			batch: (batch: FirelordFirestore.WriteBatch) => {
				return {
					commit: () => {
						return batch.commit()
					},
					delete: () => {
						return batch.delete(docWrite)
					},
					update: <J extends Partial<Write>>(
						data: J extends never
							? J
							: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
					) => {
						return batch.update(docWrite, { ...updatedAt, ...data })
					},
					set: <
						J extends Partial<WriteNested>,
						Z extends { merge?: true; mergeField?: (keyof Write)[] }
					>(
						data: J extends never
							? J
							: Z extends undefined
							? WriteNested
							: Z['merge'] extends true
							? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
							: Z['mergeField'] extends (keyof Write)[]
							? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
							: WriteNested,
						options?: Z
					) => {
						return batch.set(docWrite, data, options || {})
					},
					create: (data: WriteNestedCreate) => {
						return batch.create(docWrite, {
							...createdAt,
							...data,
						})
					},
				}
			},
			transaction: (transaction: FirelordFirestore.Transaction) => {
				return {
					create: (data: WriteNestedCreate) => {
						return transaction.create(docWrite, {
							...createdAt,
							...data,
						})
					},
					set: <
						J extends Partial<WriteNested>,
						Z extends { merge?: true; mergeField?: (keyof Write)[] }
					>(
						data: J extends never
							? J
							: Z extends undefined
							? WriteNested
							: Z['merge'] extends true
							? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
							: Z['mergeField'] extends (keyof Write)[]
							? PartialNoImplicitUndefinedAndNoExtraMember<WriteNested, J>
							: WriteNested,
						options?: Z
					) => {
						return transaction.set(
							docWrite,
							{
								...updatedAt,
								...data,
							},
							options || {}
						)
					},
					update: <J extends Partial<Write>>(
						data: J extends never
							? J
							: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
					) => {
						return transaction.update(docWrite, { ...updatedAt, ...data })
					},
					delete: () => {
						return transaction.delete(docWrite)
					},
					get: () => {
						return transaction.get(docRead).then(documentSnapshot => {
							return docSnapshotCreator<T, M>(
								firestore,
								colRef,
								documentSnapshot
							)
						})
					},
					getAll: <J extends [...FirelordFirestore.DocumentData[]]>(
						documentReferences: [...J],
						options: FirelordFirestore.ReadOptions
					) => {
						return transaction.getAll<J>(...documentReferences, options)
					},
				}
			},
		}
	}

export type DocCreator<
	T extends Firelord.MetaType,
	M extends 'col' | 'colGroup' = 'col'
> = (
	firestore: FirelordFirestore.Firestore,
	colRef: M extends 'col'
		? FirelordFirestore.CollectionReference
		: M extends 'colGroup'
		? undefined
		: never,
	docRef:
		| FirelordFirestore.DocumentReference
		| (M extends 'col' ? undefined : M extends 'colGroup' ? never : never)
) => (documentID?: T['docID']) => {
	firestore: FirelordFirestore.FirebaseFirestore
	id: string
	parent: FirelordFirestore.CollectionReference<T['read']>
	path: string
	listCollections: () => Promise<
		FirelordFirestore.CollectionReference<FirelordFirestore.DocumentData>[]
	>
	isEqual: (other: FirelordFirestore.DocumentReference) => boolean
	onSnapshot: (
		next?:
			| ((documentSnapshot: ReturnType<DocSnapshotCreator<T, M>>) => void)
			| undefined,
		error?: ((error: Error) => void) | undefined
	) => () => void
	create: (
		data: Firelord.InternalReadWriteConverter<T>['writeNestedCreate']
	) => Promise<FirelordFirestore.WriteResult>
	set: <
		J_1 extends Partial<Firelord.InternalReadWriteConverter<T>['writeNested']>,
		Z extends {
			merge?: true | undefined
			mergeField?:
				| Exclude<keyof T['write'], 'createdAt' | 'updatedAt'>[]
				| undefined
		}
	>(
		data: J_1 extends never
			? J_1
			: Z extends undefined
			? Firelord.InternalReadWriteConverter<T>['writeNested']
			: Z['merge'] extends true
			? PartialNoImplicitUndefinedAndNoExtraMember<
					Firelord.InternalReadWriteConverter<T>['writeNested'],
					J_1
			  >
			: Z['mergeField'] extends Exclude<
					keyof T['write'],
					'createdAt' | 'updatedAt'
			  >[]
			? PartialNoImplicitUndefinedAndNoExtraMember<
					Firelord.InternalReadWriteConverter<T>['writeNested'],
					J_1
			  >
			: Firelord.InternalReadWriteConverter<T>['writeNested'],
		options?: Z | undefined
	) => Promise<FirelordFirestore.WriteResult>
	update: <
		J_2 extends Partial<Firelord.InternalReadWriteConverter<T>['write']>
	>(
		data: J_2 extends never
			? J_2
			: PartialNoImplicitUndefinedAndNoExtraMember<
					Firelord.InternalReadWriteConverter<T>['write'],
					J_2
			  >
	) => Promise<FirelordFirestore.WriteResult>
	get: () => Promise<ReturnType<DocSnapshotCreator<T, M>>>
	delete: () => Promise<FirelordFirestore.WriteResult>
	batch: (batch: FirelordFirestore.WriteBatch) => {
		commit: () => Promise<FirelordFirestore.WriteResult[]>
		delete: () => FirelordFirestore.WriteBatch
		update: <
			J_3 extends Partial<Firelord.InternalReadWriteConverter<T>['write']>
		>(
			data: J_3 extends never
				? J_3
				: PartialNoImplicitUndefinedAndNoExtraMember<
						Firelord.InternalReadWriteConverter<T>['write'],
						J_3
				  >
		) => FirelordFirestore.WriteBatch
		set: <
			J_7 extends Partial<
				Firelord.InternalReadWriteConverter<T>['writeNested']
			>,
			Z_2 extends {
				merge?: true | undefined
				mergeField?:
					| Exclude<keyof T['write'], 'createdAt' | 'updatedAt'>[]
					| undefined
			}
		>(
			data: J_7 extends never
				? J_7
				: Z_2 extends undefined
				? Firelord.InternalReadWriteConverter<T>['writeNested']
				: Z_2['merge'] extends true
				? PartialNoImplicitUndefinedAndNoExtraMember<
						Firelord.InternalReadWriteConverter<T>['writeNested'],
						J_7
				  >
				: Z_2['mergeField'] extends Exclude<
						keyof T['write'],
						'createdAt' | 'updatedAt'
				  >[]
				? PartialNoImplicitUndefinedAndNoExtraMember<
						Firelord.InternalReadWriteConverter<T>['writeNested'],
						J_7
				  >
				: Firelord.InternalReadWriteConverter<T>['writeNested'],
			options?: Z_2 | undefined
		) => FirelordFirestore.WriteBatch
		create: (
			data: Firelord.InternalReadWriteConverter<T>['writeNestedCreate']
		) => FirelordFirestore.WriteBatch
	}
	transaction: (transaction: FirelordFirestore.Transaction) => {
		create: (
			data: Firelord.InternalReadWriteConverter<T>['writeNestedCreate']
		) => FirelordFirestore.Transaction
		set: <
			J_4 extends Partial<
				Firelord.InternalReadWriteConverter<T>['writeNested']
			>,
			Z_1 extends {
				merge?: true | undefined
				mergeField?:
					| Exclude<keyof T['write'], 'createdAt' | 'updatedAt'>[]
					| undefined
			}
		>(
			data: J_4 extends never
				? J_4
				: Z_1 extends undefined
				? Firelord.InternalReadWriteConverter<T>['writeNested']
				: Z_1['merge'] extends true
				? PartialNoImplicitUndefinedAndNoExtraMember<
						Firelord.InternalReadWriteConverter<T>['writeNested'],
						J_4
				  >
				: Z_1['mergeField'] extends Exclude<
						keyof T['write'],
						'createdAt' | 'updatedAt'
				  >[]
				? PartialNoImplicitUndefinedAndNoExtraMember<
						Firelord.InternalReadWriteConverter<T>['writeNested'],
						J_4
				  >
				: Firelord.InternalReadWriteConverter<T>['writeNested'],
			options?: Z_1 | undefined
		) => FirelordFirestore.Transaction
		update: <
			J_5 extends Partial<Firelord.InternalReadWriteConverter<T>['write']>
		>(
			data: J_5 extends never
				? J_5
				: PartialNoImplicitUndefinedAndNoExtraMember<
						Firelord.InternalReadWriteConverter<T>['write'],
						J_5
				  >
		) => FirelordFirestore.Transaction
		delete: () => FirelordFirestore.Transaction
		get: () => Promise<ReturnType<DocSnapshotCreator<T, M>>>
		getAll: <J_6 extends [...FirelordFirestore.DocumentData[]]>(
			documentReferences: [...J_6],
			options: FirelordFirestore.ReadOptions
		) => Promise<FirelordFirestore.DocumentSnapshot<J_6>[]>
	}
}
