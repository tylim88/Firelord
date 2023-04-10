import { example } from './init'
import { query, where, orderBy, onSnapshot, startAfter, offset } from 'firelord'

// filter and listen to documents
const unsub = onSnapshot(
	query(
		example.collectionGroup(),
		where('b.d', 'array-contains', { e: 'hello' }),
		orderBy('f.g'),
		startAfter(new Date()),
		offset(1)
	),
	querySnapshot => {
		// return querySnapshot similar to querySnapshot of getDocs
	},
	error => {}
)

// listen to a single document
const unsub2 = onSnapshot(
	example.doc('abc'),
	docSnapshot => {
		// return docSnapshot similar to docSnapshot of getDoc
	},
	error => {}
)

// remove listeners
unsub()
unsub2()
