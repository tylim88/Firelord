import {
	ReadOnlyTransactionOptions,
	ReadWriteTransactionOptions,
} from '../types'

export const isTransactionOptions = (
	value: unknown
): value is ReadOnlyTransactionOptions | ReadWriteTransactionOptions => {
	return typeof value !== 'function'
}
