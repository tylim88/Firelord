import { writeBatch } from '.'
import {
	userRefCreator,
	initializeApp,
	generateRandomData,
	readThenCompareWithWriteData,
} from '../utilForTests'
import { setDoc } from '../operations'
import { deleteField } from '../fieldValues'
import { getFirestore } from 'firebase-admin/firestore'
import { WriteBatchUpdate, IsTrue, IsSame } from '../types'

initializeApp()
const userRef = userRefCreator()
// dont need to add TYPE test code anymore, because it share the same type with basic operation where type tests are done
// just need to test whether the return type is correct or not
describe('test update batch', () => {
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof writeBatch>['update']
		type B = WriteBatchUpdate
		IsTrue<IsSame<A, B>>()
	})
	it('test full update functionality', async () => {
		const batch = writeBatch(getFirestore())
		const docRef = userRef.doc('FirelordTest', 'updateBatchTestCase')
		const docRef2 = userRef.doc('FirelordTest', 'updateBatchTestCase2')
		const docRef3 = userRef.doc('FirelordTest', 'updateBatchTestCase3')
		const data = generateRandomData()
		const data2 = generateRandomData()
		const data3 = generateRandomData()
		const p1 = setDoc(docRef, generateRandomData())
		const p2 = setDoc(docRef2, generateRandomData())
		const p3 = setDoc(docRef3, generateRandomData())
		await Promise.all([p1, p2, p3])
		batch.updateNoFlatten(docRef, data)
		batch.updateNoFlatten(docRef2, data2)
		batch.updateNoFlatten(docRef3, data3)
		await batch.commit()
		const p4 = readThenCompareWithWriteData(data, docRef)
		const p5 = readThenCompareWithWriteData(data2, docRef2)
		const p6 = readThenCompareWithWriteData(data3, docRef3)
		await Promise.all([p4, p5, p6])
	})

	it('test delete field type', async () => {
		;() => {
			const batch = writeBatch()

			const ref = userRef.doc(
				'FirelordTest',
				'updateBatchSpecificFieldTestCase'
			)
			const date = new Date()
			const arr = [{ g: false, h: date, m: 9 }]
			const num = Math.random()
			batch.updateNoFlatten(ref, {
				age: deleteField(),
				a: {
					// cannot assign delete field in nested property of non-flatten operation data
					// @ts-expect-error
					'i.j': deleteField(),
				},
				'a.b': { f: arr },
				'a.b.c': num,
			})
		}
	})
	it('test empty data', async () => {
		const batch = writeBatch(getFirestore())
		const docRef = userRef.doc('FirelordTest', 'updateBatchTestCaseEmpty')
		expect.assertions(1)
		try {
			batch.updateNoFlatten(
				docRef,
				// @ts-expect-error
				{}
			)
		} catch (e) {
			expect(true).toBe(true)
		}
	})
})
