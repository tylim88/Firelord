import {
	initializeApp,
	grandChildRefCreator,
	userRefCreator,
	GrandChild,
} from '../utilForTests'
import { refEqual } from '../equal'
import { IsSame, IsTrue, CollectionReference, MetaType } from '../types'

initializeApp()

const userRef = userRefCreator()

describe('simple collection type test', () => {
	it('test invalid doc ID, negative test', () => {
		expect(() =>
			userRef.doc(
				'FirelordTest',
				// @ts-expect-error
				'a/b'
			)
		).toThrow()

		userRef.doc(
			'FirelordTest',
			// @ts-expect-error
			'.'
		)

		userRef.doc(
			'FirelordTest',
			// @ts-expect-error
			'a..b'
		)
	})

	it('test props value and type', async () => {
		const id = 'abc'
		const id2 = 'xyz'
		const ref = grandChildRefCreator().doc('FirelordTest', id, id2)
		const parentRef = grandChildRefCreator().collection('FirelordTest', id)
		const documents = await ref.listCollections()
		expect(ref.id).toBe('xyz')
		expect(ref.path).toBe(`topLevel/FirelordTest/Users/${id}/GrandChild/${id2}`)

		expect(refEqual(ref.parent, parentRef)).toBe(true)
		expect(Array.isArray(documents)).toBe(true)

		IsTrue<IsSame<typeof ref.id, string>>()
		IsTrue<
			IsSame<
				typeof ref.path,
				| `topLevel/FirelordTest/Users/${string}/GrandChild/${string}`
				| `topLevel/ForCursorTest/Users/${string}/GrandChild/${string}`
				| `topLevel/ForAggCountTest/Users/${string}/GrandChild/${string}`
			>
		>()
		IsTrue<IsSame<typeof ref.parent, CollectionReference<GrandChild>>>()
		IsTrue<IsSame<typeof documents, CollectionReference<MetaType>[]>>()
	})
	it('test auto generate id', () => {
		const ref = userRef.doc(userRef.collection('FirelordTest'))
		const splitPath = ref.path.split('/')
		expect(splitPath.length).toBe(4)
		expect(splitPath[splitPath.length - 1]!.length).toBe(20)
	})
})
