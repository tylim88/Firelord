import { MetaType } from './metaTypeCreator'
import { DocumentReference } from './refs'
import { Transaction } from './transaction'
import { WriteBatch } from './batch'
import { Precondition, WriteResult } from './alias'

type DeleteCreator<U> = <T extends MetaType>(
	reference: DocumentReference<T>,
	precondition?: Precondition
) => U

export type Delete = DeleteCreator<Promise<WriteResult>>

export type WriteBatchDelete = DeleteCreator<WriteBatch>

export type TransactionDelete = DeleteCreator<Transaction>
