import {
	OmitKeys,
	PartialNoImplicitUndefinedAndNoExtraMember,
	ExcludePropertyKeys,
} from './firelord'
import { FirelordFirestore } from './firelordFirestore'
import { queryCreator } from './queryCreator'
import { firelord as fl } from './index_'

export const firelord: fl =
	(firestore: FirelordFirestore.Firestore) =>
	<
		T extends {
			colPath: string
			docPath: string
			read: FirelordFirestore.DocumentData &
				FirelordFirestore.CreatedUpdatedRead
			write: FirelordFirestore.DocumentData &
				FirelordFirestore.CreatedUpdatedWrite
			compare: FirelordFirestore.DocumentData &
				FirelordFirestore.CreatedUpdatedCompare
			base: FirelordFirestore.DocumentData
		} = never
	>() => {
		type Write = OmitKeys<T['write'], 'updatedAt' | 'createdAt'>
		type Read = T['read']
		type Compare = T['compare']
		type WithoutArrayTypeMember = ExcludePropertyKeys<Compare, unknown[]>

		const time = firestore.FieldValue.serverTimestamp()

		const newTime = {
			createdAt: time,
			updatedAt: new Date(0),
		}

		const col = (collectionPath: T['colPath']) => {
			const colRefWrite = firestore().collection(
				collectionPath
			) as FirelordFirestore.CollectionReference<Write>
			const colRefRead =
				colRefWrite as FirelordFirestore.CollectionReference<Read>

			const doc = (documentPath: T['docPath']) => {
				const docWrite = colRefWrite.doc(documentPath)

				const docRead = colRefRead.doc(documentPath)

				const transactionCreator = (
					transaction: FirelordFirestore.Transaction
				) => {
					return {
						create: (data: Write) => {
							return transaction.create(docWrite, {
								...newTime,
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
								: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>,
							options?: Z
						) => {
							if (options) {
								return transaction.set(
									docWrite,
									{
										updatedAt: time,
										...data,
									},
									options
								)
							} else {
								return transaction.set(docWrite, {
									...newTime,
									...data,
								})
							}
						},
						update: <J extends Partial<Write>>(
							data: J extends never
								? J
								: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
						) => {
							return transaction.update(docWrite, { updatedAt: time, ...data })
						},
						delete: () => {
							return transaction.delete(docWrite)
						},
						get: () => {
							return transaction.get(docRead)
						},
						getAll: <
							J extends FirelordFirestore.DocumentData = FirelordFirestore.DocumentData
						>(
							documentReferences: J[],
							options: FirelordFirestore.ReadOptions
						) => {
							return transaction.getAll<J>(...documentReferences, options)
						},
					}
				}

				return {
					firestore: docRead.firestore,
					id: docRead.id,
					parent: docRead.parent,
					path: docRead.path,
					listCollections: () => {
						return docRead.listCollections()
					},
					isEqual: (
						other: FirelordFirestore.DocumentReference<FirelordFirestore.DocumentData>
					) => {
						return docRead.isEqual(
							other as FirelordFirestore.DocumentReference<Read>
						)
					},
					onSnapshot: (
						next?: (snapshot: FirelordFirestore.DocumentSnapshot<Read>) => void,
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
						return docWrite.create({
							...newTime,
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
							? PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
							: Z['mergeField'] extends (keyof Write)[]
							? PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
							: Write,
						options?: Z
					) => {
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
								...newTime,
								...data,
							})
						}
					},
					update: <J extends Partial<Write>>(
						data: J extends never
							? J
							: PartialNoImplicitUndefinedAndNoExtraMember<Write, J>
					) => {
						return docWrite.update({
							updatedAt: time,
							...data,
						})
					},
					get: () => {
						return docRead.get()
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
								return batch.update(docWrite, { updatedAt: time, ...data })
							},
							create: (data: Write) => {
								return batch.create(docWrite, {
									...newTime,
									...data,
								})
							},
						}
					},
					runTransaction: (
						callback: (
							transaction: ReturnType<typeof transactionCreator>
						) => Promise<unknown>
					) => {
						firestore().runTransaction(async transaction => {
							return callback(transactionCreator(transaction))
						})
					},
				}
			}

			// https://github.com/microsoft/TypeScript/issues/32022
			// https://stackoverflow.com/questions/51591335/typescript-spead-operator-on-object-with-method
			return {
				parent: colRefRead.parent,
				path: colRefRead.path,
				id: colRefRead.id,
				listDocuments: () => {
					return colRefRead.listDocuments()
				},
				doc,
				add: (data: Write) => {
					return colRefWrite.add({
						...newTime,
						...data,
					})
				},
				...queryCreator<Read, Compare, WithoutArrayTypeMember>(colRefRead),
			}
		}

		const colGroup = (collectionPath: T['colPath']) => {
			const colRefRead = firestore().collectionGroup(
				collectionPath
			) as FirelordFirestore.CollectionGroup<Read>
			return queryCreator<Read, Compare, WithoutArrayTypeMember>(colRefRead)
		}

		return { col, colGroup }
	}

export const ozai = firelord

export { flatten } from './flat'

export type { Firelord } from './firelord'

export * from './fieldValue'
