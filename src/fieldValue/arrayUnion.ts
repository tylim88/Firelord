import { FieldValue } from 'firebase-admin/firestore'
import { ArrayUnionOrRemove, ErrorArrayFieldValueEmpty } from '../types'
/**
Returns a special value that can be used with @firebase/firestore/lite#(setDoc:1) or * @firebase/firestore/lite#(updateDoc:1) that tells the server to union the given elements with any array value that already exists on the server. Each specified element that doesn't already exist in the array will be added to the end. If the field being modified is not already an array it will be overwritten with an array containing exactly the specified elements.

@param elements — The elements to union into the array.

@returns
The FieldValue sentinel for use in a call to setDoc() or updateDoc().
 */
export const arrayUnion = <Elements extends unknown[]>(
	...elements: Elements extends [] ? [ErrorArrayFieldValueEmpty] : Elements
) => {
	// * web don't have empty array issue
	const filler = elements.length === 0 ? [[]] : elements
	const ref = FieldValue.arrayUnion(...filler) as ArrayUnionOrRemove<
		Elements[number]
	>
	ref['Firelord.ArrayFieldValue'] = elements

	return ref
}
