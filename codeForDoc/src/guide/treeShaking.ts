import {
	getFirelord,
	getFirestore,
	MetaTypeCreator,
	docCreator,
	collectionCreator,
	collectionGroupCreator,
} from 'firelord'
type ExampleParent = MetaTypeCreator<
	{
		b: number
	},
	'someCollectionId_1'
>
type Example = MetaTypeCreator<
	{
		a: number
	},
	'someCollectionId_2',
	string,
	ExampleParent
>
const db = getFirestore()
const collectionID = 'someCollectionId_2'
const collectionIDArr = ['someCollectionId_1', collectionID] as const // it is an array

const example1 = getFirelord<Example>(db, ...collectionIDArr)

// example2 and example1 are the same thing
// example2 is tree shakable because you can remove unwanted functionalities.
const example2 = {
	doc: docCreator<Example>(db, ...collectionIDArr),
	collection: collectionCreator<Example>(db, ...collectionIDArr),
	collectionGroup: collectionGroupCreator<Example>(db, collectionID), // collection group requires only the last segment collection id
}
