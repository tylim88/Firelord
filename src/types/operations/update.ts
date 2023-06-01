import { ExactOptional } from '../exactOptional'
import { DocumentReference } from '../refs'
import { Precondition, WriteResult, DocumentData } from '../alias'
import { Transaction } from '../transaction'
import { WriteBatch } from '../batch'
import { MetaType } from '../metaTypeCreator'

export type UpdateCreator<U, NoFlatten extends boolean> = <
	T extends MetaType,
	Data extends DocumentData
>(
	reference: DocumentReference<T>,
	data: Data extends never
		? Data
		: ExactOptional<T['writeFlatten'], Data, false, NoFlatten, true>,
	precondition?: Precondition
) => U

export type Update = UpdateCreator<Promise<WriteResult | undefined>, false>

export type UpdateNoFlatten = UpdateCreator<
	Promise<WriteResult | undefined>,
	true
>

export type TransactionUpdate = UpdateCreator<Transaction | undefined, false>

export type TransactionUpdateNoFlatten = UpdateCreator<
	Transaction | undefined,
	true
>

export type WriteBatchUpdate = UpdateCreator<WriteBatch | undefined, false>

export type WriteBatchUpdateNoFlatten = UpdateCreator<
	WriteBatch | undefined,
	true
>
