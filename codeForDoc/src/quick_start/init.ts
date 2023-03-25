import { getFirelord, getFirestore } from 'firelord'
import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app'
import { Example } from './dataType'

const app = initializeApp()

import serviceAccount from '../serviceAccount.json'
const app_ = initializeApp({
	credential: cert(serviceAccount as ServiceAccount),
})

export const db = getFirestore(app)

export const example = getFirelord<Example>(db, 'SomeCollectionName') // this is your firelordRef
