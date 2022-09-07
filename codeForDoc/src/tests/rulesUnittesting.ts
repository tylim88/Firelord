import {
	setDoc,
	getFirelord,
	getDocs,
	query,
	where,
	onSnapshot,
	runTransaction,
	writeBatch,
	MetaTypeCreator,
} from 'firelord'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp } from 'firebase-admin/app'

initializeApp({ projectId: 'forTestJustUseRandomId' })

type User = MetaTypeCreator<{ name: string; age: number }, 'User', string>
const firestore = getFirestore()
const userRef = getFirelord<User>(firestore)('User')

describe('test with jest', () => {
	it('test basic operation like setDoc, updateDoc, addDoc, deleteDoc etc etc', async () => {
		const ref = userRef.doc('user1')
		await setDoc(ref, { age: 30, name: 'John' })
		// some other operations
		// do your assertion here...
	})
	it('test getDocs', async () => {
		const querySnapshot = await getDocs(
			query(userRef.collectionGroup(firestore), where('name', '==', 'abc'))
		)
		// do your assertion here...
	})

	it('test onSnapshot', done => {
		expect.hasAssertions()

		const unsub = onSnapshot(
			query(userRef.collection(firestore), where('age', '>', 10)),
			async querySnapshot => {
				// do your assertion here...
				unsub()
				done()
			}
		)
	})
	it('test transaction operations', async () => {
		await runTransaction(firestore, async transaction => {
			await transaction.update(userRef.doc('user1'), {
				age: 20,
			})
			// some other operations
		})
		// do your assertion here...
	})

	it('test batch operations', async () => {
		const batch = writeBatch(firestore)
		batch.delete(userRef.doc('user1'))
		// some other operations
		// do your assertion here...
	})
})
