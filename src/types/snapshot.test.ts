import { IsTrue, IsSame } from './utils'
import { DocumentSnapshot } from './snapshot'
import { User } from '../utilForTests'

const documentSnapshot = 1 as unknown as DocumentSnapshot<User>
it('test return data type', () => {
	;() => {
		const data = documentSnapshot.data()
		if (data) {
			/*  eslint-disable @typescript-eslint/no-unused-vars */
			const {
				beenTo,
				name,
				role,
				age,
				a: {
					b: {
						c,
						f,
						// @ts-expect-error
						p,
					},
				},
				// @ts-expect-error
				unknown,
			} = data
			/*  eslint-enable @typescript-eslint/no-unused-vars */
		}
	}
})
it('test exists type', () => {
	;() => {
		const target = documentSnapshot.exists
		type A = typeof target
		type B = boolean
		IsTrue<IsSame<A, B>>()
	}
})

it('test data type with no option', () => {
	;() => {
		const target = documentSnapshot.data()
		type A = NonNullable<typeof target>['a']['k']
		type B = User['read']['a']['k'] | null
		IsTrue<IsSame<A, B>>()
	}
})

it('test get type with no option', () => {
	;() => {
		const target = documentSnapshot.get('a.k')
		type A = typeof target
		type B = User['read']['a']['k'] | undefined | null
		IsTrue<IsSame<A, B>>()
	}
})
