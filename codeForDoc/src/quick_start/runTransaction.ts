import { example, db } from './create_firelord_ref'
import {
	runTransaction,
	serverTimestamp,
	increment,
	arrayRemove,
	Timestamp,
} from 'firelord'

export const dummy = async () => {
	try {
		// OR you can skip 'db'
		await runTransaction(
			db,
			async transaction => {
				await transaction.get(example.doc('lmn')).then(docSnapshot => {
					const data = docSnapshot.data()
				})

				transaction.create(example.doc('lmn'), {
					a: 500,
					b: { c: true, d: [{ e: 'efg' }] },
					f: { g: serverTimestamp(), h: 3838 },
				})

				transaction.set(example.doc('lmn'), {
					a: 88,
					b: { c: false, d: [{ e: 'opq' }] },
					f: { g: serverTimestamp(), h: 2929 },
				})

				transaction.update(example.doc('lmn'), {
					a: increment(1),
					b: { d: arrayRemove({ e: 'rst' }) }, // nested form
					'f.g': serverTimestamp(), // dot notation form
				})

				transaction.delete(example.doc('lmn'))
			},
			{ readOnly: true, readTime: Timestamp.now() } // optional
			// we can supply 2 set of options:
			// 1. { readOnly?: false, maxAttempts?: number }
			// note that in case 1 both properties are optional and readOnly is false
			// 2. { readOnly: true, readTime?: Timestamp }
			// note that in case only readTime is optional and readOnly is true
		)
		console.log('Transaction successfully committed!')
	} catch (e) {
		console.log('Transaction failed: ', e)
	}
}
