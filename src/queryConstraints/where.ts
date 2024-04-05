import { Where } from '../types'
import crypto from 'crypto'

/**
 * Creates a QueryConstraint that enforces that documents must contain the
 * specified field and that the value should satisfy the relation constraint
 * provided.
 *
 * @param fieldPath - The path to compare
 * @param opStr - The operation string (e.g "&lt;", "&lt;=", "==", "&lt;",
 *   "&lt;=", "!=").
 * @param value - The value for comparison
 * @returns The created Query.
 */
export const where: Where = (fieldPath, opStr, value) => {
	let newValue = value
	if (
		Array.isArray(newValue) &&
		(opStr === 'in' || opStr === 'array-contains-any' || opStr === 'not-in') &&
		newValue.length === 0
	) {
		newValue = [
			crypto.randomUUID() + crypto.randomUUID() + crypto.randomUUID(),
		] as typeof newValue
	}

	return {
		type: 'where',
		fieldPath: fieldPath,
		opStr,
		value: newValue,
	}
}
