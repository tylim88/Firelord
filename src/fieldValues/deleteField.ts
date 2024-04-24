import { FieldValue } from 'firebase-admin/firestore'
import { Delete } from '../types'

/**
 * Returns a sentinel for use with update() or set() with {merge:true} to
 * mark a field for deletion.
 *
 * @return The FieldValue sentinel for use in a call to set() or update().
 */
export const deleteField = () => FieldValue.delete() as Delete
