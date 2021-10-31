import { Firelord } from './firelord'
import { FirelordFirestore } from './firelordFirestore'
import { queryCreator } from './queryCreator'
import { firelord as FirelordWrapper } from './index_'
import { docCreator } from './doc'
import { createTime } from './utils'

export const firelord: FirelordWrapper =
	(firestore: FirelordFirestore.Firestore) =>
	<
		T extends {
			colPath: string
			docID: string
			colName: string
			read: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedRead
			write: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
			writeNested: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedWrite
			compare: FirelordFirestore.DocumentData & Firelord.CreatedUpdatedCompare
			base: FirelordFirestore.DocumentData
		} = never
	>() => {
		type Write = Firelord.InternalReadWriteConverter<T>['write']
		type WriteNested = Firelord.InternalReadWriteConverter<T>['writeNested']
		type Read = Firelord.InternalReadWriteConverter<T>['read']
		type Compare = Firelord.InternalReadWriteConverter<T>['compare']
		type WithoutArrayTypeMember =
			Firelord.InternalReadWriteConverter<T>['withoutArrayTypeMember']

		const { createdAt } = createTime(firestore)

		const col = (collectionPath: T['colPath']) => {
			const colRefWrite = firestore().collection(
				collectionPath
			) as FirelordFirestore.CollectionReference<Write>
			const colRefRead =
				colRefWrite as FirelordFirestore.CollectionReference<Read>

			// https://github.com/microsoft/TypeScript/issues/32022
			// https://stackoverflow.com/questions/51591335/typescript-spead-operator-on-object-with-method
			return {
				parent: colRefRead.parent,
				path: colRefRead.path,
				id: colRefRead.id,
				listDocuments: () => {
					return colRefRead.listDocuments()
				},
				doc: docCreator<T>(firestore, colRefWrite),
				add: (data: WriteNested) => {
					return colRefWrite
						.add({
							...createdAt,
							...data,
						})
						.then(documentReference => {
							return docCreator<T>(
								firestore,
								colRefWrite,
								documentReference
							)(documentReference.id)
						})
				},
				...queryCreator<T>(firestore, colRefRead, colRefRead),
			}
		}

		const colGroup = (collectionPath: T['colName']) => {
			const colRefRead = firestore().collectionGroup(
				collectionPath
			) as FirelordFirestore.CollectionGroup<Read>
			return queryCreator<T, never, 'colGroup'>(
				firestore,
				colRefRead,
				colRefRead
			)
		}

		return {
			col,
			colGroup,
			fieldValue: {
				increment: (value: number) => {
					return firestore.FieldValue.increment(
						value
					) as unknown as Firelord.NumberMasked
				},

				serverTimestamp: () => {
					return firestore.FieldValue.serverTimestamp() as unknown as Firelord.ServerTimestampMasked
				},

				arrayUnion: <T>(...values: T[]) => {
					return firestore.FieldValue.arrayUnion(
						...values
					) as unknown as Firelord.ArrayMasked<T>
				},
				arrayRemove: <T>(...values: T[]) => {
					return firestore.FieldValue.arrayRemove(
						...values
					) as unknown as Firelord.ArrayMasked<T>
				},
			},
		}
	}

export const ozai = firelord

export { flatten } from './utils'

export type { Firelord } from './firelord'
