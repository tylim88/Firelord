import { FieldValue } from 'firebase-admin/firestore'
import { ServerTimestamp } from '../types'

/**
Returns a sentinel used with @firebase/firestore/lite#(setDoc:1) or @firebase/firestore/lite#(updateDoc:1) to include a server-generated timestamp in the written data.
 */
export const serverTimestamp = () => {
	const ref = FieldValue.serverTimestamp() as ServerTimestamp
	return ref
}
