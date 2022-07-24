import { MetaType } from './metaTypeCreator'
import { DocumentReference } from './refs'
import { RecursivelyReplaceDeleteFieldWithErrorMsg } from './partialNoUndefinedAndNoUnknownMember'
import { Transaction } from './transaction'
import { WriteBatch } from './batch'
import { WriteResult } from './alias'

type CreateCreator<U> = <
	T extends MetaType,
	// https://stackoverflow.com/questions/71223634/typescript-interface-causing-type-instantiation-is-excessively-deep-and-possibl
	Data extends Record<string, unknown>
>(
	reference: DocumentReference<T>,
	data: Data extends never
		? Data
		: RecursivelyReplaceDeleteFieldWithErrorMsg<T['write'], Data>
) => U

export type Create = CreateCreator<Promise<WriteResult>>

export type TransactionCreate = CreateCreator<Transaction>

export type WriteBatchCreate = CreateCreator<WriteBatch>
