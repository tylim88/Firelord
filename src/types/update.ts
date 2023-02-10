import { PartialNoUndefinedAndNoUnknownMemberNoEmptyMember } from './partialNoUndefinedAndNoUnknownMember'
import { DocumentReference } from './refs'
import { Precondition, WriteResult, DocumentData } from './alias'
import { Transaction } from './transaction'
import { WriteBatch } from './batch'
import { MetaType } from './metaTypeCreator'

export type UpdateCreator<U> = <T extends MetaType, Data extends DocumentData>(
	reference: DocumentReference<T>,
	data: Data extends never
		? Data
		: PartialNoUndefinedAndNoUnknownMemberNoEmptyMember<
				T['writeFlatten'],
				Data,
				false
		  >,
	precondition?: Precondition
) => U

export type Update = UpdateCreator<Promise<WriteResult | undefined>>

export type TransactionUpdate = UpdateCreator<Transaction | undefined>

export type WriteBatchUpdate = UpdateCreator<WriteBatch | undefined>
