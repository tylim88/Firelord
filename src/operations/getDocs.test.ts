import { getDocs } from './getDocs'
import {
	generateRandomData,
	compareWriteDataWithDocSnapData,
	initializeApp,
	userRefCreator,
	User,
} from '../utilForTests'
import { setDoc } from './setDoc'
import {
	IsSame,
	IsTrue,
	QuerySnapshot,
	QueryDocumentSnapshot,
	Query,
	DocumentReference,
} from '../types'
import { query } from '../refs'
import { where } from '../queryClauses'
import { snapshotEqual, queryEqual, refEqual } from '../equal'

initializeApp()
const userRef = userRefCreator()
const queryTest = async (
	shareQuery: Query<User>,
	docId: string,
	data: User['write'],
	docRef: DocumentReference<User>
) => {
	await setDoc(docRef, data)
	expect.hasAssertions()
	const querySnapshot = await getDocs(shareQuery)
	type A = typeof querySnapshot
	type B = QuerySnapshot<User>
	IsTrue<IsSame<B, A>>()
	const queryDocumentSnapshot = querySnapshot.docs.filter(
		doc => doc.id === docId
	)[0]
	expect(queryDocumentSnapshot).not.toBe(undefined)
	if (queryDocumentSnapshot) {
		type X = typeof queryDocumentSnapshot
		type Y = QueryDocumentSnapshot<User>
		IsTrue<IsSame<X, Y>>()
		await compareWriteDataWithDocSnapData(data, queryDocumentSnapshot)
	}
	const incorrectDocRef = userRefCreator().doc('FirelordTest', 'abc')
	expect(snapshotEqual(querySnapshot, querySnapshot)).toBe(true)
	expect(refEqual(queryDocumentSnapshot!.ref, docRef)).toBe(true)
	expect(refEqual(queryDocumentSnapshot!.ref, incorrectDocRef)).toBe(false)
	expect(queryEqual(queryDocumentSnapshot!.ref.parent, docRef.parent)).toBe(
		true
	)
	expect(
		queryEqual(queryDocumentSnapshot!.ref.parent, incorrectDocRef.parent)
	).toBe(true)
}

describe('test getDocs', () => {
	it('test naked query functionality and type', async () => {
		const docId = 'getDocsNakedQueryTest'
		const docRef = userRef.doc('FirelordTest', docId)
		const data = generateRandomData()
		const shareQuery = query(userRef.collection('FirelordTest'))
		await queryTest(shareQuery, docId, data, docRef)
	})

	it('test query functionality and type with clause', async () => {
		const docId = 'getDocsWithOptionsQueryTest'
		const docRef = userRef.doc('FirelordTest', docId)
		const data = generateRandomData()
		const shareQuery = query(
			userRef.collection('FirelordTest'),
			where('a.b.c', '==', data.a.b.c as number)
		)
		await queryTest(shareQuery, docId, data, docRef)
	})

	it('test collection group', async () => {
		const docId = 'getDocsWithOptionsQueryTest'
		const docRef = userRef.doc('FirelordTest', docId)
		const data = generateRandomData()
		const shareQuery = query(
			userRef.collectionGroup(),
			where('a.b.c', '==', data.a.b.c as number)
		)
		await queryTest(shareQuery, docId, data, docRef)
	})

	it('test empty array with ( in ) filter', async () => {
		const arr: number[] = []
		const shareQuery = query(
			userRef.collectionGroup(),
			where('a.b.c', 'in', arr)
		)
		const querySnap = await getDocs(shareQuery)
		expect(querySnap.docs.length).toBe(0)
	})

	it('test empty array with ( not-in ) filter', async () => {
		const arr: number[] = []
		const shareQuery = query(
			userRef.collectionGroup(),
			where('a.b.c', 'not-in', arr)
		)
		const querySnap = await getDocs(shareQuery)
		expect(querySnap.docs.length).not.toBe(0)
	})

	it('test empty array with ( array-contains-any ) filter', async () => {
		const arr: string[] = []
		const shareQuery = query(
			userRef.collectionGroup(),
			where('a.e', 'array-contains-any', arr)
		)
		const querySnap = await getDocs(shareQuery)
		expect(querySnap.docs.length).toBe(0)
	})
})
