import { query } from './query'
import { limit, orderBy, where } from '../queryConstraints'
import { userRefCreator, initializeApp } from '../utilForTests'
import { documentId } from '../fieldPath'
import { Timestamp } from 'firebase-admin/firestore'

initializeApp()
const user = userRefCreator()
const ref = user.collectionGroup()
const fullDocPath = 'topLevel/FirelordTest/Users/a' as const // https://stackoverflow.com/questions/71575344/typescript-stop-object-type-from-widening-generic/71575870#71575870
describe('test query ref', () => {
	it('In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field, negative test', () => {
		query(
			ref,
			where(documentId(), '>', fullDocPath),
			limit(1),
			// @ts-expect-error
			where('a.b.c', '!=', 2)
		) // * throw in web
		query(
			ref,
			where('age', '>', 2),
			limit(1),
			// @ts-expect-error
			where('a.b.c', '!=', 2)
		) // * throw in web

		query(
			ref,
			where('age', '>', 2),
			limit(1),
			// @ts-expect-error
			where('a.b.c', '!=', 2)
		) // * throw in web

		query(
			ref,
			where('age', '<=', 2),
			limit(1),
			// @ts-expect-error
			where('a.b.c', 'not-in', [2])
		) // * throw in web

		query(
			ref,
			where('age', 'not-in', [2]),
			limit(1),
			// @ts-expect-error
			where('a.b.c', '<', 2)
		) // * throw in web
	})

	it('In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field, positive test', () => {
		query(
			ref,
			where(documentId(), '>', fullDocPath),
			limit(1),
			where(documentId(), '!=', fullDocPath)
		)
		query(ref, where('age', '>', 2), limit(1), where('age', '!=', 2))
		query(ref, where('a.b.c', '>', 2), limit(1), where('a.b.c', '!=', 2))
		query(ref, where('age', '<=', 2), limit(1), where('age', 'not-in', [2]))
		query(ref, where('a.b.c', 'not-in', [2]), limit(1), where('a.b.c', '<', 2))
	})

	it('If you include a filter with an inequality  ( <, <=, !=, not-in, >, or >=), your first ordering must be on the same field, negative case', () => {
		query(
			ref,
			// @ts-expect-error
			orderBy('a.i'),
			where('age', '>=', 2)
		) // * throw in web

		query(
			ref,
			// @ts-expect-error
			where('age', '>', 2),
			orderBy('a.i')
		) // * throw in web

		query(
			ref,
			// @ts-expect-error
			orderBy('a.i'),
			limit(1),
			where('age', '>=', 2)
		) // * throw in web

		query(
			ref,
			// @ts-expect-error
			where('age', '!=', 2),
			limit(1),
			orderBy('a.i')
		) // * throw in web

		query(
			ref,
			// @ts-expect-error
			where('a.b.c', '<', 1),
			limit(1),
			orderBy('__name__')
		) // * throw in web

		expect(() =>
			query(
				ref,
				// @ts-expect-error
				where(documentId(), 'not-in', ['a']),
				limit(1),
				orderBy('a.i')
			)
		).toThrow()
	})

	it('If you include a filter with an inequality  ( <, <=, !=, not-in, >, or >=), your first ordering must be on the same field, positive case', () => {
		query(ref, orderBy('age'), where('age', '>=', 2))
		query(ref, where('a.k', '>=', new Date()), orderBy('a.k'))
		query(
			ref,
			orderBy('a.k'),
			limit(1),
			where('a.k', '>=', Timestamp.fromDate(new Date()))
		)
		query(
			ref,
			where('a.k', '>=', Timestamp.fromMillis(8913748127389)),
			limit(1),
			orderBy('a.k')
		)
		query(
			ref,
			where(documentId(), '>=', fullDocPath),
			limit(1),
			orderBy('__name__')
		)
	})

	it(`You can't order your query by a field included in an equality (==) or (in) clause, negative case`, () => {
		// throw in getDocs/onSnapshot

		query(
			ref,
			// @ts-expect-error
			orderBy('__name__'),
			where(documentId(), '==', fullDocPath)
		)
		query(
			ref,
			// @ts-expect-error
			orderBy('age'),
			limit(1),
			where('age', '==', 1)
		)
		query(
			ref,
			where('age', '==', 1),
			limit(1),
			// @ts-expect-error
			orderBy('age')
		)
		query(
			ref,
			// @ts-expect-error
			orderBy('age'),
			where('age', '==', 1)
		)
		query(
			ref,
			where('age', 'in', [1]),
			// @ts-expect-error
			orderBy('age')
		)
		query(
			ref,
			// @ts-expect-error
			orderBy('age'),
			limit(1),
			where('age', '==', 1)
		)
		query(
			ref,
			where('age', '==', 1),
			limit(1),
			// @ts-expect-error
			orderBy('age')
		)
	})

	it(`You can't order your query by a field included in an equality (==) or in clause, positive case`, () => {
		query(ref, orderBy('__name__'), where(documentId(), '>', fullDocPath))
		query(ref, orderBy('age'), where('age', '>=', 1))
		query(ref, where('age', '==', 1), orderBy('a.k'))
		query(ref, orderBy('age'), limit(1), where('age', 'not-in', [1]))
		query(ref, where('a.e', 'array-contains', 'a'), limit(1), orderBy('a.e'))
	})

	it(`You can use at most one in, not-in, or array-contains-any clause per query. You can't combine in , not-in, and array-contains-any in the same query. negative case`, () => {
		query(
			ref,
			where(documentId(), 'not-in', [fullDocPath]),
			limit(1), // @ts-expect-error
			where('a.e', 'array-contains-any', ['1'])
		) // * throw in web

		query(
			ref,
			where('name', 'not-in', ['1']),
			limit(1), // @ts-expect-error
			where('a.e', 'array-contains-any', ['1'])
		) // * throw in web

		query(
			ref,
			where('a.e', 'in', [['1']]),
			limit(1), // @ts-expect-error
			where('a.e', 'array-contains-any', ['1'])
		) // * throw in web

		query(
			ref,
			where('name', 'not-in', ['1']),
			limit(1), // @ts-expect-error
			where('a.e', 'in', [['1']])
		) // * throw in web

		query(
			ref,
			where('a.e', 'array-contains-any', ['1']),
			limit(1), // @ts-expect-error
			where('a.e', 'array-contains-any', ['1'])
		) // * throw in web

		query(
			ref,
			where('a.e', 'in', [['1']]),
			limit(1), // @ts-expect-error
			where('a.e', 'in', ['1'])
		) // * throw in web

		query(
			ref,
			where('name', 'not-in', ['1']),
			limit(1), // @ts-expect-error
			where('a.e', 'not-in', [['1']])
		) // * throw in web
	})
	it(`You can't combine not-in with not equals !=, negative case`, () => {
		query(
			ref,
			where(documentId(), 'not-in', [fullDocPath]),
			limit(1),
			// @ts-expect-error
			where('age', '!=', 1)
		) // * throw in web

		query(
			ref,
			where('age', 'not-in', [1]),
			limit(1),
			// @ts-expect-error
			where('age', '!=', 1)
		) // * throw in web
	})

	it(`You can use at most one array-contains clause per query. You can't combine array-contains with array-contains-any, negative case`, () => {
		query(
			ref,
			where('a.e', 'array-contains', '1'),
			limit(1),
			// @ts-expect-error
			where('a.e', 'array-contains', '2')
		) // * throw in web

		query(
			ref,
			where('a.e', 'array-contains', '1'),
			limit(1),
			// @ts-expect-error
			where('a.e', 'array-contains-any', ['2'])
		) // * throw in web

		query(
			ref,
			where('a.e', 'array-contains-any', ['2']),
			limit(1),
			// @ts-expect-error
			where('a.e', 'array-contains', '1')
		) // * throw in web
	})

	it(`You cannot use more than one '!=' filter (undocumented limitation), negative case`, () => {
		query(
			ref,
			where(documentId(), '!=', fullDocPath),
			limit(1),
			// @ts-expect-error
			where('age', '!=', 1)
		) // * throw in web

		query(
			ref,
			where('age', '!=', 1),
			limit(1),
			// @ts-expect-error
			where('age', '!=', 1)
		) // * throw in web

		query(
			ref,
			where('age', '!=', 1),
			limit(1),
			// @ts-expect-error
			where('a.b.c', '!=', 1)
		) // * throw in web
	})
})
