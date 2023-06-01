import { getFirelord } from '.'
import { Timestamp, getFirestore } from 'firebase-admin/firestore'
import {
	MetaTypeCreator,
	ServerTimestamp,
	DocumentReference,
	DeleteField,
	DocumentSnapshot,
} from './types'
import pick from 'pick-random'
import betwin from 'betwin'
import { getDoc } from './operations'
import { flatten } from './utils'
import { cloneDeep } from 'lodash'
import { arrayUnion, increment, serverTimestamp } from './fieldValues'
import {
	initializeApp as initializeApp_,
	cert,
	ServiceAccount,
} from 'firebase-admin/app'

export const initializeApp = () => {
	const env = process.env
	return initializeApp_({
		credential: cert({
			type: 'service_account',
			project_id: env.PROJECT_ID,
			private_key_id: env.PRIVATE_KEY_ID,
			private_key: JSON.parse(env.PRIVATE_KEY!),
			client_email: `firebase-adminsdk-ptef8@${env.PROJECT_ID}.iam.gserviceaccount.com`,
			client_id: env.CLIENT_ID,
			auth_uri: 'https://accounts.google.com/o/oauth2/auth',
			token_uri: 'https://oauth2.googleapis.com/token',
			auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
			client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ptef8%40${env.PROJECT_ID}.iam.gserviceaccount.com`,
		} as ServiceAccount),
	})
}

export type Parent = MetaTypeCreator<
	{
		a: 1
	},
	'topLevel',
	'FirelordTest' | 'ForCursorTest' | 'ForAggCountTest'
>

export type User = MetaTypeCreator<
	{
		age: number | DeleteField
		beenTo: (
			| Record<'US', ('Hawaii' | 'California')[]>
			| Record<'China', ('Guangdong' | 'Shanghai')[]>
		)[]
		name: string
		role: 'admin' | 'editor' | 'visitor'
		a: {
			b: { c: number; f: { g: boolean; h: Date; m: number }[] }
			i: { j: number | DeleteField; l: Date }
			e: string[]
			k: ServerTimestamp | DeleteField
		}
	},
	'Users',
	string,
	Parent
>

export type GrandChild = MetaTypeCreator<
	{
		a: 1
	},
	'GrandChild',
	string,
	User
>

export const userRefCreator = () =>
	getFirelord<User>(getFirestore(), `topLevel`, `Users`)

export const grandChildRefCreator = () =>
	getFirelord<GrandChild>(getFirestore(), `topLevel`, `Users`, 'GrandChild')

export const generateRandomData = (): User['write'] => {
	const beenTo = (pick([[{ China: ['Guangdong'] }], [{ US: ['california'] }]], {
		count: pick([1, 2])[0] as number,
	})[0] || []) as (
		| {
				US: ('Hawaii' | 'California')[]
		  }
		| {
				China: ('Guangdong' | 'Shanghai')[]
		  }
	)[]

	const name = pick(['abc', 'efg'])[0] || 'jkl'
	const role = (pick(['admin', 'editor', 'visitor'])[0] || 'admin') as
		| 'admin'
		| 'editor'
		| 'visitor'
	const age = Math.random()
	const a = {
		b: {
			c: Math.random(),
			f: [{ g: !pick([true, false])[0], h: new Date(), m: 2 }],
		},
		e: arrayUnion(
			...pick(['a', ...betwin('a', 'z'), 'z'], {
				count: pick([0, ...betwin(0, 9), 9])[0] as number,
			})
		),
		i: { j: increment(1), l: new Date() },
		k: serverTimestamp(),
	}

	return { beenTo, name, role, age, a }
}

export const compareWriteDataWithDocSnapData = (
	writeData: User['write'],
	docSnap: DocumentSnapshot<User>
) => {
	const data = cloneDeep(writeData)
	const readData = docSnap.data()
	const exists = docSnap.exists
	expect(exists).toBe(true)
	expect(readData).not.toBe(undefined)
	if (readData) {
		// convert date
		data.a.b.f = (
			data.a.b.f as {
				g: boolean
				h: Date | Timestamp
				m: number
			}[]
		).map(item => {
			item.h = Timestamp.fromDate(item.h as Date)
			return item
		})
		// convert field value
		data.a.i.l = Timestamp.fromDate(data.a.i.l as Date)
		data.a.e = docSnap.get('a.e') as string[]
		data.a.i.j = docSnap.get('a.i.j') as number
		data.a.k = docSnap.get('a.k') as unknown as ServerTimestamp

		expect(readData).toEqual(data)

		const fieldPaths: Parameters<typeof docSnap.get>[0][] = [
			'age',
			'beenTo',
			'name',
			'role',
			'a.e',
			'a.k',
			'a.b.c',
			'a.b.f',
			'a.i.j',
			'a.i.l',
		]
		const flattenData = flatten(readData)
		fieldPaths.forEach(fieldPath => {
			expect({ data: docSnap.get(fieldPath), fieldPath }).toEqual({
				data: flattenData[fieldPath],
				fieldPath,
			})
		})
	}
}

export const readThenCompareWithWriteData = async (
	writeData: User['write'],
	ref: DocumentReference<User>
) => {
	const docSnap = await getDoc(ref)
	compareWriteDataWithDocSnapData(cloneDeep(writeData), docSnap)
}

export const writeThenCompareWithRead = async (
	writeCallback: (
		data: ReturnType<typeof generateRandomData>
	) => Promise<DocumentReference<User>>
) => {
	const data = generateRandomData()

	const ref = await writeCallback(data)
	await readThenCompareWithWriteData(data, ref)
}
