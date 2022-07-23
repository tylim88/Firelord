import { example } from './init'
import {
	getDoc,
	setDoc,
	updateDoc,
	deleteDoc,
	addDoc,
	serverTimestamp,
	increment,
	arrayUnion,
	createDoc,
} from 'firelord'

export const dummy = async () => {
	await createDoc(example.doc('abc'), {
		a: 500,
		b: { c: true, d: [{ e: 'efg' }] },
		f: { g: serverTimestamp(), h: 2929 },
	})

	await setDoc(example.doc('abc'), {
		a: 100,
		b: { c: true, d: [{ e: 'abc' }] },
		f: { g: serverTimestamp(), h: 1010 },
	})

	await addDoc(example.collection(), {
		a: 900,
		b: { c: false, d: [{ e: 'hi' }] },
		f: { g: serverTimestamp(), h: 3838 },
	})

	await updateDoc(example.doc('abc'), {
		a: increment(1),
		'b.d': arrayUnion({ e: 'hello' }), // dot notation form
		f: { h: 2929 }, // nested form
	})

	await deleteDoc(example.doc('abc'))

	await getDoc(example.doc('abc')).then(docSnapshot => {
		const data = docSnapshot.data()
	})
}
