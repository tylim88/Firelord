import { getFirelord, getFirestore } from 'firelord'
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { Example } from './dataType'
// if you run in cloud function
const app = initializeApp()

// if you run in custom backend or you run in cloud function but want to access other project firestore
import serviceAccount from './serviceAccount.json' // get it from firebase console --> project setting --> service accounts, THIS IS A SECERT!
const app = initializeApp({
	credential: cert(serviceAccount as ServiceAccount),
})

export const db = getFirestore() // or getFirestore(app), you can skip this line

// Recommendation: Export this if the collection is sub-collection and then fill in collection path later, because sub collection most likely have dynamic document ID.
export const firelordExample = getFirelord<Example>() // or getFirelord<Example>(db)
// then call them using
// const example = firelordExample(`parentCollectionName/${someDocId}/SomeCollectionName`) // this is your firelordRef

// Recommendation: Export this if the collection is root collection
export const example = firelordExample('SomeCollectionName') // this is your firelordRef
