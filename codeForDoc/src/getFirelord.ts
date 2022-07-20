import { getDoc, MetaTypeCreator, getFirelord, ServerTimestamp } from 'firelord'

type abc = MetaTypeCreator<
	{
		a: number
		b: {
			c: number
			d: ServerTimestamp // server timestamp
		}
	},
	'abc',
	string
>

const docRef = getFirelord<abc>()('abc').doc('efg')
getDoc(docRef).then(docSnapshot => {
	// @ts-expect-error
	docSnapshot.get('n.j')
	// good: reject unknown path!
	//
	//
	//
	//
	//
	//
	const data = docSnapshot.get('b.d')
	// good: return correct type!
})
