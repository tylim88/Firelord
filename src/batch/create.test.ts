import {
	userRefCreator,
	initializeApp,
	readThenCompareWithWriteData,
	generateRandomData,
} from '../utilForTests'
import { getFirestore } from 'firebase-admin/firestore'
import { writeBatch } from '.'
import { getDoc } from '../operations'
import { IsTrue, IsSame, WriteBatchCreate } from '../types'

initializeApp()
const userRef = userRefCreator()
// don't need to add TYPE test code anymore, because it share the same type with basic operation where type tests are done
// just need to test whether the return type is correct or not
describe('test create batch', () => {
	const docRef = userRef.doc('FirelordTest', 'createBatchTestCase')
	const docRef2 = userRef.doc('FirelordTest', 'createBatchTestCase2')
	const docRef3 = userRef.doc('FirelordTest', 'createBatchTestCase3')
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof writeBatch>['create']
		type B = WriteBatchCreate
		IsTrue<IsSame<A, B>>()
	})
	it('test create functionality', async () => {
		const batch = writeBatch(getFirestore())
		const data = generateRandomData()
		const data2 = generateRandomData()
		const data3 = generateRandomData()
		batch.create(docRef, data)
		batch.create(docRef2, data2)
		batch.create(docRef3, data3)
		await batch.commit()
		await readThenCompareWithWriteData(data, docRef)
		await readThenCompareWithWriteData(data2, docRef2)
		await readThenCompareWithWriteData(data3, docRef3)
	})
	it('test create on existing document', async () => {
		expect.assertions(1)
		const batch = writeBatch(getFirestore())
		const data = generateRandomData()
		batch.create(docRef, data)
		await batch.commit().catch(() => {
			expect(true).toBe(true)
		})
	})
	it('test delete functionality', async () => {
		const batch = writeBatch(getFirestore())
		batch.delete(docRef)
		batch.delete(docRef2)
		batch.delete(docRef3)
		await batch.commit()
		const docSnap = getDoc(docRef)
		const docSnap2 = getDoc(docRef2)
		const docSnap3 = getDoc(docRef3)
		const snapshots = await Promise.all([docSnap, docSnap2, docSnap3])
		expect(snapshots.map(snapshot => snapshot.exists)).toEqual([
			false,
			false,
			false,
		])
	})
})
