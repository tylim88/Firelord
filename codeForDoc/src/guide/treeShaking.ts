import {
	getFirestore,
	MetaTypeCreator,
	docCreator,
	collectionCreator,
	collectionGroupCreator,
	getFirelordShakable,
} from 'firelord'

type Example = MetaTypeCreator<
	{
		a: number
	},
	'someCollectionId',
	string
>
const db = getFirestore()

const getFirelord = getFirelordShakable({
	// all properties are optional
	// choose what to keep
	docCreator,
	collectionCreator,
	collectionGroupCreator,
})

const example = getFirelord<Example>(db, 'someCollectionId')
