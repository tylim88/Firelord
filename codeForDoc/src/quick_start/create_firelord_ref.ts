import { getFirelord, getFirestore } from 'firelord'
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { Example } from './define_meta_type'
// if you run in cloud function
const app = initializeApp()

// if you run in custom backend or you run in cloud function but want to access other project firestore
import serviceAccount from '../serviceAccount.json' // get it from firebase console --> project setting --> service accounts, THIS IS A SECERT!
const app_ = initializeApp({
	credential: cert(serviceAccount as ServiceAccount),
})

export const db = getFirestore()

export const example = getFirelord<Example>(db, 'SomeCollectionName') // this is your firelordRef
