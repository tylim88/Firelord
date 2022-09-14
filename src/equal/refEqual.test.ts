import { refEqual } from './refEqual'
import { initializeApp, userRefCreator, User } from '../utilForTests'
import { DocumentReference, CollectionReference } from '../types'
import { getFirestore } from 'firebase-admin/firestore'

initializeApp()
const abc = 'abc'
const docRefCreator = (arg: string) => userRefCreator().doc('FirelordTest', arg)
const colRef = userRefCreator().collection('FirelordTest')
describe('test refEqual', () => {
	it('test equal', () => {
		expect(refEqual(docRefCreator(abc), docRefCreator(abc))).toBe(true)
		expect(
			refEqual(
				docRefCreator(abc),

				getFirestore().doc(
					docRefCreator(abc).path
				) as unknown as DocumentReference<User>
			)
		).toBe(true)
		expect(refEqual(colRef, colRef)).toBe(true)
		expect(
			refEqual(
				colRef,
				getFirestore().collection(
					colRef.path
				) as unknown as CollectionReference<User>
			)
		).toBe(true)
	})
	it('test not equal', () => {
		expect(refEqual(docRefCreator(abc), docRefCreator('abcd'))).toBe(false)
		expect(
			refEqual(
				docRefCreator(abc),
				getFirestore().doc(
					docRefCreator('abc1').path
				) as unknown as DocumentReference<User>
			)
		).toBe(false)
		expect(
			refEqual(
				colRef,
				getFirestore().collection(
					'a/b/c1'
				) as unknown as CollectionReference<User>
			)
		).toBe(false)
	})
})
