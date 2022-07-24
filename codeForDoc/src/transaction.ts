import { example, db } from './init'
import {
	runTransaction,
	serverTimestamp,
	increment,
	arrayRemove,
} from 'firelord'

export const dummy = async () => {
	try {
		await runTransaction(db, async transaction => {
			// ...
		})
		// OR you can skip 'db'
		await runTransaction(async transaction => {
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
		})
		console.log('Transaction successfully committed!')
	} catch (e) {
		console.log('Transaction failed: ', e)
	}
}
