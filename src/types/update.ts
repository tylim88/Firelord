import {
	MetaType,
	DocumentReference,
	PartialNoUndefinedAndNoUnknownMemberNoEmptyMember,
} from '../types'
import { Precondition, WriteResult } from './alias'
import { Transaction } from './transaction'
import { WriteBatch } from './batch'

export type UpdateCreator<U> = <
	T extends MetaType,
	Data extends import('@firebase/firestore').DocumentData
>(
	reference: DocumentReference<T>,
	data: Data extends never
		? Data
		: PartialNoUndefinedAndNoUnknownMemberNoEmptyMember<
				T['writeFlatten'],
				Data,
				false,
				false
		  >,
	precondition?: Precondition
) => U

export type Update = UpdateCreator<Promise<WriteResult | undefined>>

export type TransactionUpdate = UpdateCreator<Transaction | undefined>

export type WriteBatchUpdate = UpdateCreator<WriteBatch | undefined>
