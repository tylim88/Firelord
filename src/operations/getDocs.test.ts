import { getDocs } from './getDocs'
import {
	generateRandomData,
	compareWriteDataWithDocSnapData,
	initializeApp,
	userRefCreator,
	User,
} from '../utilForTests'
import { setDoc } from '../operations'
import {
	IsSame,
	IsTrue,
	QuerySnapshot,
	QueryDocumentSnapshot,
	Query,
	DocumentReference,
} from '../types'
import { query } from '../refs'
import { where, orderBy, endAt, startAt } from '../queryClauses'
import { snapshotEqual } from '../equal'

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

	expect(snapshotEqual(querySnapshot, querySnapshot)).toBe(true)
}

describe('test getDocs', () => {
	it('test naked query functionality and type', async () => {
		const docId = 'getDocsNakedQueryTest'
		const docRef = userRef.doc(docId)
		const data = generateRandomData()
		const shareQuery = query(userRef.collection())
		await queryTest(shareQuery, docId, data, docRef)
	})

	it('test query functionality and type with clause', async () => {
		const docId = 'getDocsWithOptionsQueryTest'
		const docRef = userRef.doc(docId)
		const data = generateRandomData()
		const shareQuery = query(
			userRef.collection(),
			where('a.b.c', '==', data.a.b.c as number)
		)
		await queryTest(shareQuery, docId, data, docRef)
	})

	it('test collection group', async () => {
		const docId = 'getDocsWithOptionsQueryTest'
		const docRef = userRef.doc(docId)
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

	it('cursor test', async () => {
		const d1 = generateRandomData()
		const d2 = generateRandomData()
		const d3 = generateRandomData()
		const d4 = generateRandomData()
		const p1 = setDoc(userRef.doc('1'), d1)
		const p2 = setDoc(userRef.doc('2'), d2)
		const p3 = setDoc(userRef.doc('3'), d3)
		const p4 = setDoc(userRef.doc('4'), d4)
		await Promise.all([p1, p2, p3, p4])

		expect.assertions(2)

		const p5 = getDocs(
			query(userRef.collectionGroup(), orderBy('age'), endAt(d3.age as number))
		).then(querySnapshot => {
			const doc = querySnapshot.docs[querySnapshot.docs.length - 1]
			if (doc) {
				const data = doc.data()
				expect(data.age).toBe(d3.age)
			}
		})
		const p6 = getDocs(
			query(
				userRef.collectionGroup(),
				orderBy('age'),
				startAt(d1.age as number)
			)
		).then(querySnapshot => {
			const doc = querySnapshot.docs[0]
			if (doc) {
				const data = doc.data()
				expect(data.age).toBe(d1.age)
			}
		})

		await Promise.all([p5, p6])
	})
})
