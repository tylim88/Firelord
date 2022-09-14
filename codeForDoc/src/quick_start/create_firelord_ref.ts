import { getFirelord, getFirestore } from 'firelord'
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { Example } from './define_meta_type'

const app = initializeApp()

import serviceAccount from '../serviceAccount.json'
const app_ = initializeApp({
	credential: cert(serviceAccount as ServiceAccount),
})

export const db = getFirestore()

export const example = getFirelord<Example>(db, 'SomeCollectionName') // this is your firelordRef
