import { example, db } from './create_firelord_ref'
import {
	runTransaction,
	serverTimestamp,
	increment,
	arrayRemove,
	Timestamp,
} from 'firelord'
//
;async () => {
	try {
		const result = await runTransaction(
			db, // db argument is optional, you can skip it
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

				return 123 // return this to result
			},
			{ readOnly: true, readTime: Timestamp.now() } // optional, { readOnly?: false, maxAttempts?: number } OR { readOnly: true, readTime?: Timestamp }
		)
		console.log(result) // result is 123 because we return 123 in runTransaction callback
	} catch (e) {
		console.log('Transaction failed: ', e)
	}
}
