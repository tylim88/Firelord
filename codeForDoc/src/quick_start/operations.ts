import { example } from './create_firelord_ref'
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
//
;async () => {
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

	await updateDoc(example.doc('abc'), {
		a: increment(1),
		'b.d': arrayUnion({ e: 'hello' }), // dot notation form
		f: { h: 2929 }, // nested form
	})

	await deleteDoc(example.doc('abc'))

	await getDoc(example.doc('abc')).then(docSnapshot => {
		docSnapshot.data()
		docSnapshot.get('b.c')
		docSnapshot.id

		docSnapshot.ref.firestore
		docSnapshot.ref.id
		docSnapshot.ref.listCollections()
		docSnapshot.ref.path

		docSnapshot.ref.parent
		docSnapshot.ref.parent.firestore
		docSnapshot.ref.parent.id
		docSnapshot.ref.parent.listDocuments()
		docSnapshot.ref.parent.parent
	})

	// in case you want to create auto id doc
	await addDoc(example.collection(), {
		a: 900,
		b: { c: false, d: [{ e: 'hi' }] },
		f: { g: serverTimestamp(), h: 3838 },
	})
	// in case you just want auto id ref
	const autoIdDocRef = example.doc(example.collection())
}
