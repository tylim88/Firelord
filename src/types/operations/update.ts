import { ExactOptional } from '../exactOptional'
import { DocumentReference } from '../refs'
import { Precondition, WriteResult, DocumentData } from '../alias'
import { Transaction } from '../transaction'
import { WriteBatch } from '../batch'
import { MetaType } from '../metaTypeCreator'

export type UpdateCreator<U, NoFlatten extends boolean> = <
	T extends MetaType,
	const Data extends DocumentData
>(
	reference: DocumentReference<T>,
	data: Data extends never
		? Data
		: ExactOptional<T['writeFlatten'], Data, false, NoFlatten, true>,
	precondition?: Precondition
) => U

export type Update = UpdateCreator<Promise<WriteResult>, false>

export type UpdateNoFlatten = UpdateCreator<Promise<WriteResult>, true>

export type TransactionUpdate = UpdateCreator<Transaction, false>

export type TransactionUpdateNoFlatten = UpdateCreator<Transaction, true>

export type WriteBatchUpdate = UpdateCreator<WriteBatch, false>

export type WriteBatchUpdateNoFlatten = UpdateCreator<WriteBatch, true>
