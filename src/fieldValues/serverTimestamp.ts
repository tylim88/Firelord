import { FieldValue } from 'firebase-admin/firestore'
import { ServerTimestamp } from '../types'

/**
 * Returns a sentinel used with set(), create() or update() to include a
 * server-generated timestamp in the written data.
 *
 * @return The FieldValue sentinel for use in a call to set(), create() or
 * update().
 */

export const serverTimestamp = (): ServerTimestamp =>
	// @ts-expect-error
	FieldValue.serverTimestamp()
