import { FieldValue } from 'firebase-admin/firestore'
import { DeleteField } from '../types'

/**
Returns a sentinel for use with @firebase/firestore/lite#(updateDoc:1) or @firebase/firestore/lite#(setDoc:1) with {merge: true} to mark a field for deletion.
 */
export const deleteField = () => {
	const ref = FieldValue.delete() as DeleteField
	return ref
}
