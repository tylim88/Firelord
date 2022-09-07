import {
	userRefCreator,
	readThenCompareWithWriteData,
	generateRandomData,
	initializeApp,
	compareWriteDataWithDocSnapData,
} from '../utilForTests'
import { runTransaction } from '.'
import { setDoc, getDoc } from '../operations'
import { TransactionCreate, IsTrue, IsSame } from '../types'
import { createCreator } from './create'
initializeApp()
const userRef = userRefCreator()
describe('test create transaction', () => {
	it('test whether the return type is correct', () => {
		type A = ReturnType<typeof createCreator>
		type B = TransactionCreate
		IsTrue<IsSame<A, B>>()
	})
	it('test transaction return type', () => {
		;async () => {
			const A = await runTransaction(async () => {
				return 1 as const
			})

			IsTrue<IsSame<typeof A, 1>>()
		}
	})
	const docRef = userRef.doc('createTransactionTestCase')
	const docRef2 = userRef.doc('createTransactionTestCase2')
	const docRef3 = userRef.doc('createTransactionTestCase3')
	it('test create functionality', async () => {
		const data = generateRandomData()
		const data2 = generateRandomData()
		const data3 = generateRandomData()
		await runTransaction(async transaction => {
			transaction.create(docRef, data)
			transaction.create(docRef2, data2)
			transaction.create(docRef3, data3)
		})
		await readThenCompareWithWriteData(data, docRef)
		await readThenCompareWithWriteData(data2, docRef2)
		await readThenCompareWithWriteData(data3, docRef3)
	})
	it('test read functionality', async () => {
		const docRef = userRef.doc('createTransactionTestCaseRead')
		const data = generateRandomData()
		await setDoc(docRef, data)
		await runTransaction(async transaction => {
			const docSnap = await transaction.get(docRef)
			compareWriteDataWithDocSnapData(data, docSnap)
		})
	})
	it('test create on existing document', async () => {
		const data = generateRandomData()
		expect.assertions(1)
		await runTransaction(async transaction => {
			transaction.create(docRef, data)
		}).catch(() => {
			expect(true).toBe(true)
		})
	})
	it('test delete functionality', async () => {
		await runTransaction(async transaction => {
			transaction.delete(docRef)
			transaction.delete(docRef2)
			transaction.delete(docRef3)
		})
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
