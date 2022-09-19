import { createDoc } from './createDoc'

import {
	userRefCreator,
	initializeApp,
	writeThenCompareWithRead,
	generateRandomData,
} from '../utilForTests'
import { increment, arrayUnion, serverTimestamp } from '../fieldValue'
import { Create, IsTrue, IsSame } from '../types'
import { deleteDoc } from './deleteDoc'
import { getDoc } from './getDoc'

initializeApp()
const userRef = userRefCreator()
describe('test createDoc', () => {
	it('test whether the return type is correct', () => {
		type A = typeof createDoc
		type B = Create
		IsTrue<IsSame<A, B>>()
	})
	it('test wrong type', () => {
		;() =>
			createDoc(userRef.doc('FirelordTest', '123'), {
				// @ts-expect-error
				beenTo: [{}],
				// @ts-expect-error
				name: true,
				// @ts-expect-error
				role: 'admi1n',
				// @ts-expect-error
				age: '3',
				// @ts-expect-error
				a: {},
			})
		;() =>
			createDoc(userRef.doc('FirelordTest', '123'), {
				beenTo: [],
				// @ts-expect-error
				name: true,
				// @ts-expect-error
				role: 'admi1n',
				// @ts-expect-error
				age: '3',
				a: {
					b: {
						// @ts-expect-error
						c: true,
						f: [
							{
								// @ts-expect-error
								g: undefined,
								// @ts-expect-error
								h: serverTimestamp(),
								// @ts-expect-error
								m: increment(1),
							},
						],
					}, // @ts-expect-error
					e: [true],
				},
			})
	})
	it('test missing member', () => {
		;() =>
			createDoc(
				userRef.doc('FirelordTest', '123'),
				// @ts-expect-error
				{
					beenTo: [{ China: ['Guangdong'] }],
					name: 'abc',
					role: 'visitor',
				}
			)
	})
	it('test empty array', () => {
		;() =>
			createDoc(userRef.doc('FirelordTest', '123'), {
				beenTo: [],
				name: 'abc',
				role: 'admin',
				age: 30,
				a: {
					b: { c: 1, f: [] },
					e: [],
					i: { j: increment(1), l: new Date() },
					k: serverTimestamp(),
				},
			})
	})
	it('test filled array', () => {
		;() =>
			createDoc(userRef.doc('FirelordTest', '123'), {
				beenTo: [{ US: ['California', 'Hawaii'] }],
				name: 'abc',
				role: 'admin',
				age: 30,
				a: {
					b: { c: 1, f: [{ g: true, h: new Date(), m: 1 }] },
					e: arrayUnion(...['a']),
					i: { j: increment(1), l: new Date() },
					k: serverTimestamp(),
				},
			})
	})
	it('test full correct type with unknown member in stale value, should fail', () => {
		const withUnknownMember = { ...generateRandomData(), unknown: '123' }
		;() =>
			createDoc(
				userRef.doc('FirelordTest', '123'),
				// @ts-expect-error
				withUnknownMember
			)
	})
	const ref = userRef.doc('FirelordTest', 'createDocTestCase')
	it('test functionality', async () => {
		await writeThenCompareWithRead(async data => {
			await createDoc(ref, data)
			return ref
		})
	})
	it('test create on existing document', async () => {
		const data = generateRandomData()
		expect.assertions(1)
		await createDoc(ref, data).catch(() => {
			expect(true).toBe(true)
		})
	})
	it('test delete functionality', async () => {
		await deleteDoc(ref)
		const snapshot = await getDoc(ref)
		expect(snapshot.exists).toBe(false)
	})
})
