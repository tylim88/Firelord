import { query } from '../refs'
import { queryEqual } from './queryEqual'
import { initializeApp, userRefCreator } from '../utilForTests'
import { where, orderBy } from '../queryClauses'
import { getFirestore } from 'firebase-admin/firestore'
initializeApp()
const colRef = userRefCreator().collection('FirelordTest')
const groupRef = userRefCreator().collectionGroup()
describe('test queryEqual', () => {
	it('test equal', () => {
		expect(
			queryEqual(
				query(colRef, where('a.b.c', '==', 1)),
				query(colRef, where('a.b.c', '==', 1))
			)
		).toBe(true)
		expect(
			queryEqual(
				query(colRef, orderBy('a.b')),
				getFirestore().collection(colRef.path).orderBy('a.b')
			)
		).toBe(true)
	})
	it('test not equal', () => {
		expect(
			queryEqual(
				query(colRef, where('a.b.c', '==', 1)),
				query(colRef, where('age', '==', 1))
			)
		).toBe(false)
		expect(
			queryEqual(
				query(groupRef, where('a.b.c', '==', 1)),
				query(groupRef, where('age', '==', 1))
			)
		).toBe(false)
		expect(
			queryEqual(
				query(colRef, orderBy('a.b')),
				getFirestore().collection(colRef.path).where('a.b.c', '==', 1)
			)
		).toBe(false)
	})
})
