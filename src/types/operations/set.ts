import { MetaType } from '../metaTypeCreator'
import { DocumentReference } from '../refs'
import {
	PartialNoUndefinedAndNoUnknownMemberNoEmptyMember,
	RecursivelyReplaceDeleteFieldWithErrorMsg,
} from '../partialNoUndefinedAndNoUnknownMember'
import { DeepKey, RemoveLastDot } from '../objectFlatten'
import { Transaction } from '../transaction'
import { WriteBatch } from '../batch'
import { WriteResult } from 'firebase-admin/firestore'

type SetCreator<U> = <
	T extends MetaType,
	// https://stackoverflow.com/questions/71223634/typescript-interface-causing-type-instantiation-is-excessively-deep-and-possibl
	Data extends Record<string, unknown>,
	SetOptions extends
		| {
				merge: boolean
		  }
		| {
				mergeFields: RemoveLastDot<DeepKey<Data>>[]
		  }
		| undefined = undefined
>(
	reference: DocumentReference<T>,
	data: Data extends never
		? Data
		: SetOptions extends
				| {
						merge: true
				  }
				| {
						mergeFields: RemoveLastDot<DeepKey<Data>>[]
				  }
		? PartialNoUndefinedAndNoUnknownMemberNoEmptyMember<
				T['writeMerge'],
				Data,
				(
					SetOptions extends { merge: boolean }
						? SetOptions['merge']
						: SetOptions extends {
								mergeFields: RemoveLastDot<DeepKey<Data>>[]
						  }
						? SetOptions['mergeFields']
						: false
				) extends infer R extends boolean | string[]
					? R
					: never,
				false,
				true
		  >
		: RecursivelyReplaceDeleteFieldWithErrorMsg<T['write'], Data>,
	options?: SetOptions extends never ? SetOptions : SetOptions
) => U

export type Set = SetCreator<Promise<WriteResult>>

export type TransactionSet = SetCreator<Transaction>

export type WriteBatchSet = SetCreator<WriteBatch>