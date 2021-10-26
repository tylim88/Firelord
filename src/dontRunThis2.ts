// import { firelord } from '.'

// import { Firelord } from './firelord'
// import { firestore } from 'firebase-admin'
// import { flatten } from './flat'

// // create wrapper
// const wrapper = firelord(firestore)

// declare namespace Data {
// 	type Settings = Firelord.ReadWriteCreator<
// 		{
// 			user_UID: string
// 			cloudSyncTemp: boolean
// 			cloudSync: boolean
// 			device_UIDs: string[]
// 			device_models: string[]
// 			lastSyncAt: Firelord.ServerTimestamp // ! does not error when `import('firelord').` is removed, create reproduce-able example and open issue
// 		},
// 		'Users',
// 		string
// 	>

// 	type Secrets = Firelord.ReadWriteCreator<
// 		{
// 			masterPhrases: string
// 			masterPhrases_UID: string
// 			device_UIDs: string[]
// 		},
// 		'Secrets',
// 		string,
// 		Settings
// 	>
// }

// export const settings = wrapper<Data.Settings>()

// settings
// 	.col('Users')
