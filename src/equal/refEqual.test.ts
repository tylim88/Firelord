import { refEqual } from './refEqual'
import { initializeApp, userRefCreator, User } from '../utilForTests'
import { DocumentReference, CollectionReference } from '../types'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp()
const abc = 'abc'
const docRef = userRefCreator().doc
const colRef = userRefCreator().collection
describe('test refEqual', () => {
	it('test equal', () => {
		expect(refEqual(docRef(getFirestore(), abc), docRef(abc))).toBe(true)
		expect(
			refEqual(
				docRef(abc),

				getFirestore().doc(
					docRef(abc).path
				) as unknown as DocumentReference<User>
			)
		).toBe(true)
		expect(refEqual(colRef(getFirestore()), colRef())).toBe(true)
		expect(
			refEqual(
				colRef(),
				getFirestore().collection(
					colRef().path
				) as unknown as CollectionReference<User>
			)
		).toBe(true)
	})
	it('test not equal', () => {
		expect(refEqual(docRef(abc), docRef('abcd'))).toBe(false)
		expect(
			refEqual(
				docRef(getFirestore(), abc),
				getFirestore().doc(
					docRef('abc1').path
				) as unknown as DocumentReference<User>
			)
		).toBe(false)
		expect(
			refEqual(
				colRef(),
				getFirestore().collection(
					'a/b/c1'
				) as unknown as CollectionReference<User>
			)
		).toBe(false)
	})
})
