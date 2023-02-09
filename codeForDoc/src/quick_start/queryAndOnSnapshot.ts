import { example } from './create_firelord_ref'
import {
	getDocs,
	query,
	where,
	orderBy,
	onSnapshot,
	startAfter,
	limit,
	getCountFromServer,
} from 'firelord'
//
getDocs(
	query(
		example.collection(),
		where('f.h', '>', 1010 as const),
		orderBy('f.h'),
		limit(10)
	)
).then(querySnapshot => {
	querySnapshot.docChanges().forEach(docChange => {
		docChange.doc
		docChange.type
		docChange.oldIndex
		docChange.newIndex
		docChange.isEqual(docChange)
	})
	querySnapshot.forEach(docSnapshot => {})

	querySnapshot.docs.forEach(docSnapshot => {})
})

// filter and listen to documents
const unsub = onSnapshot(
	query(
		example.collectionGroup(),
		where('b.d', 'array-contains', { e: 'hello' }),
		orderBy('f.g'),
		startAfter(new Date())
	),
	querySnapshot => {},
	error => {}
)

// listen to a single document
const unsub2 = onSnapshot(
	example.doc('abc'),
	docSnapshot => {},
	error => {}
)

// remove listeners
unsub()
unsub2()

// get aggregated count
getCountFromServer(query(example.collection(), where('a', '>', 1))).then(
	aggregatedQuerySnapshot => {
		const count = aggregatedQuerySnapshot.data().count
	}
)
