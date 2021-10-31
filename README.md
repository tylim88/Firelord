<!-- markdownlint-disable MD010 -->

# firelord(BETA, Nodejs)

[![npm](https://img.shields.io/npm/v/firelord)](https://www.npmjs.com/package/firelord) [![GitHub](https://img.shields.io/github/license/tylim88/firelord)](https://github.com/tylim88/firelord/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/tylim88/firelord/pulls)

🐤 Write truly scalable firestore code with complete deep typing firestore wrapper, no more typing hell in your firestore code.

💪🏻 handle object, array, array object, object array...and all kinds of type, regardless of the nesting level!

🚀 The wrapper type all read and write operations; query field path, field value, collection path, document path, type everything!

🔥 Automatically convert all value types to corresponding `read` types, `write` types and `compare` types (good at handling timestamp and field values).

✋🏻 Not only does it safeguard your types, but it also stops you from making any incorrect implementation(use the wrapper incorrectly).

💥 Even the seemly un-type-able Firestore Field Value(serverTimestamp, arrayRemove, arrayUnion and increment) is taken care of, EVERYTHING is typed, NO TYPE IS LEFT BEHIND!!

✨ API closely resembles firestore API, low learning curve.

🌈 Strictly one-time setup per document. Once configured, you are ready. No more confusing setup in the future, simplicity at its finest.

🐉 Zero dependencies.

⛲️ Out of box typescript support.

Variants:

1. [react native](https://www.npmjs.com/package/firelordrn)
2. [js](https://www.npmjs.com/package/firelordjs)

## 🦊 Project Status

Current Status: Beta

Starting from 0.6.0, the library implemented all core functionalities, it will slowly exit beta and become production-ready. I will not add tests aggressively because I am exhausted, and to begin with, this thing is not easy(I don't know, maybe I am bad at typescript).

However, one thing for sure, this is the only firestore wrapper that offer complete typing solutions, it is **virtually impossible** for you to make any typing mistake with this library; and it is also the easiest to setup.

Ok, I may exaggerate a little, but I welcome you to prove me wrong.

Anyway, star⭐ the project if you like what I am doing, thank you.

Note: any version that is not mentioned in the changelog is document update.

## 🦙 Purpose

You may not notice this but you need to prepare 3 sets of data types to use firestore properly, best example is sever timestamp, when read, it is `Firestore.Timestamp`; when write, it is `Firestore.FieldValue`; and finally when compare, it is `Date|Firestore.Timestamp`.

Unfortunately `withConverter` is not enough to solve the type problems, there is still no feasible solutions to deal with type like date, firestore.Timestamp, number and array where different types are needed in read, write and compare(query). This library is a wrapper that introduces deep typing solutions to handle each case.

Not only does the wrapper deal with data types, but it also provides type safety for collection path, document path, firestore limitations(whenever is possible).

The best thing of all: it handles complex data types and types all their operations.

require typescript 4.1 and above

Overview:

- generate read(get operation), write type(set/update operation) and compare type(for query) for field value, example:
  - server timestamp: `{write: Firestore.FieldValue, read: Firestore.Timestamp, compare: Date | Firestore.Timestamp}`
  - number: `{write: FieldValue | number, read: number, compare:number}`
  - xArray: `{write: x[] | FieldValue, read: x[], compare: x[]}`
  - see [conversion table](#-conversion-table) for more
- `Firestore.FieldValue`, `Firestore.TimeStamp`,`Firestore.GeoPoint`,`Date` are treated as primitive types.
- One time setting per document type: define a data type, a collection path and a document path, and you are ready to go.
  - type collection path, collection group path and document path.
  - auto generate sub collection path type.
- auto generate `updatedAt` and`createdAt` timestamp.
  - auto update `updatedAt` server timestamp to **update** operation.
  - auto add `createdAt` and `updatedAt` server timestamp to **create** and **set** operation.
- type complex data type like nested object, nested array, object array, array object and all their operations regardless of their nesting level. Read [Complex Data Typing](#-complex-data-typing) for more info. NOTE: There is no path for `d.e.g.h.a` because it is inside an array, read [Complex Data Typing](#-complex-data-typing) for more info.

  ![flatten object](img/flattenObject.png)

- Check your type regardless of how deep it is.

  ![type check](img/checkType.png)

- Partial but no undefined: Prevent you from explicitly assigning `undefined` to a partial member in operation like `set`(with merge options) or `update` while still allowing you to skip that member regardless of how deep it is(You can override this behaviour by explicitly union `undefined` in the `base type`). Do note that you cannot skip any member of an object in an array due to how firestore array works, read [Complex Data Typing](#-complex-data-typing) for more info.

  ![partial but no undefined](img/updateAndUndefined.png)

- Reject stranger member: prevent you from writing stranger member (not exist in type) into `set`,`create` and `update` operations, stop unnecessary data from entering firestore, regardless of how deep the strange member is located.

  ![reject stranger member](img/strangerMember.png)

- Prevent you from chaining <`offset`> or <`limit` and `limit to last`> for the 2nd time no matter how you chain them.

  ![limit offset](img/limitOffset.png)

- much better `where` and `orderBy` clause

  - field values are typed accordingly to field path
  - comparators depend on field value type, eg you cannot apply `array-contains` operator onto non-array field value
  - whether you can chain orderBy clause or not is depends on the comparator's value, this is according to [orderBy limitation](https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations), see image below. Go to [Order And Limit](#-collection-operations-order-and-limit) for documentation.

  ![orderBy limitation](img/orderBy.png)

- The 4 musketeers: serverTimestamp(FieldValue), arrayRemove(FieldValue), arrayUnion(FieldValue) and increment(FieldValue) are now typed, see [Handling Firestore Field Value: Masking](#-handling-firestore-field-value-masking) for more info.

  ![field value](img/fieldValue.png)

## 🦜 Getting Started

```bash
npm i firelord
npm i -D ts-essentials
```

The wrapper requires `ts-essentials` to work, install it as dev-dependency.

The package is only 15KB before zipping and uglify, it looks big due to the images in the documentation.

### Collection

```ts
import { firelord, Firelord } from 'firelord'
import { firestore } from 'firebase-admin'

// create wrapper
const wrapper = firelord(firestore)

// use base type to generate read and write type
type User = Firelord.ReadWriteCreator<
	{
		name: string
		age: number
		birthday: Date
		joinDate: Firelord.ServerTimestamp
		beenTo: ('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[]
	}, // base type
	'Users', // collection path type
	string // document ID type
>

// implement wrapper
const userCreator = wrapper<User>()
// collection reference
const users = userCreator.col('Users') // collection path type is "Users"
// collection group reference
const userGroup = userCreator.colGroup('Users') // collection group path type is "Users"
// document reference
const user = users.doc('1234567890') // document ID is string
```

if you need the types, here is how you get it.

```ts
// import User

// read type
type UserRead = User['read'] // {name: string, age:number, birthday:firestore.Timestamp, joinDate: firestore.Timestamp, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[], createdAt: firestore.Timestamp, updatedAt: firestore.Timestamp}

// write type
type UserWrite = User['write'] // {name: string, age:number|FirebaseFirestore.FieldValue, birthday:firestore.Timestamp | Date, joinDate:FirebaseFirestore.FieldValue, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[] | FirebaseFirestore.FieldValue, createdAt: FirebaseFirestore.FieldValue, updatedAt: FirebaseFirestore.FieldValue}

// compare type
type UserCompare = User['compare'] // {name: string, age:number, birthday:Date | firestore.Timestamp, joinDate: Date | firestore.Timestamp, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[], createdAt: Date | firestore.Timestamp, updatedAt: Date | firestore.Timestamp}

// collection name
type UserColName = User['colName'] //"Users"

// collection path
type UserColPath = User['colPath'] // "Users"

// document ID
type UserDocId = User['docID'] // string

// documentPath
type UserDocPath = User['docPath']
```

### Sub-Collection

This is how you define a sub-collection, just plug in parent type into the type generator's 4th parameter and the wrapper know this is a sub-collection.

The wrapper will constructs all the collection, document and collection group path types for you, easy-peasy.

```ts
// import User
// import Firelord
// import wrapper

// subCollection of User
type Transaction = Firelord.ReadWriteCreator<
	{
		amount: number
		date: Firelord.ServerTimestamp
		status: 'Fail' | 'Success'
	}, // base type
	'Transactions', // collection path type
	string, // document ID type
	User // insert parent collection, it will auto construct the sub collection path for you
>

// implement the wrapper
const transactions = wrapper<Transaction>().col('Users/283277782/Transactions') // the type for col is `User/${string}/Transactions`
const transactionGroup = wrapper<Transaction>().colGroup('Transactions') // the type for collection group is `Transactions`
const transaction = users.doc('1234567890') // document ID is string
```

Normally a collection should only have one type of document(recommended), however if your collection has more than one type of document, the solution is to simply define more base type.

## 🦔 Conversion Table

The wrapper generate 3 types based on base type:

1. read type: the type you get when you call `get` or `onSnapshot`.
2. write type: the type for `add`, `set`, `create` and `update` operations, the type is further split into:

   -`write` type: flattened type for update operation.

   -`writeNested` type: normal object type for `add`, `set` and `create` operations.

3. compare type: the type you use in `where` clause.

All read operations return `read type` data, all write operations require `write type` data and all queries require `compare type` data, you only need to define `base type` and the wrapper will generate the other 3 types for you.

You don't need to do any kind of manipulation onto `read`, `write` and `compare` types, nor do you need to use them.

The documentation explains how the types work, the wrapper itself is intuitive in practice. thoroughly refer to the documentation only if you hit the dead end.

You SHOULD NOT try to memorize how the typing work, keep in mind the purpose is not for you to fit into the type, but is to let the type GUIDE you.

| Base                             | Read                  | Write                                                                                                              | Compare                                      |
| -------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| number                           | number                | number \| FirebaseFirestore.FieldValue(increment\*)                                                                | number                                       |
| string                           | string                | string                                                                                                             | string                                       |
| null                             | null                  | null                                                                                                               | null                                         |
| undefined                        | undefined             | undefined                                                                                                          | undefined                                    |
| Date                             | firestore.Timestamp   | firestore.Timestamp \|Date                                                                                         | firestore.Timestamp \|Date                   |
| firestore.Timestamp              | firestore.Timestamp   | firestore.Timestamp \|Date                                                                                         | firestore.Timestamp \|Date                   |
| Firelord.ServerTimestamp\*\*\*   | firestore.Timestamp   | FirebaseFirestore.FieldValue(ServerTimestamp\*)                                                                    | firestore.Timestamp \|Date                   |
| firestore.GeoPoint               | firestore.GeoPoint    | firestore.GeoPoint                                                                                                 | firestore.GeoPoint                           |
| object\*\*                       | object                | object                                                                                                             | object                                       |
| number[]                         | number[]              | number[] \|FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*)                                                  | number[]                                     |
| string[]                         | string[]              | string[] \|FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*)                                                  | string[]                                     |
| null[]                           | null[]                | null[] \|FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*)                                                    | null[]                                       |
| undefined[]                      | undefined[]           | undefined[] \|FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*)                                               | undefined[]                                  |
| Date[]                           | firestore.Timestamp[] | (firestore.Timestamp \|Date )[] \|FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*)                           | (Date \| firestore.Timestamp)[]              |
| firestore.Timestamp[]            | firestore.Timestamp[] | (firestore.Timestamp \|Date )[] \|FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*)                           | (Date \| firestore.Timestamp)[]              |
| Firelord.ServerTimestamp[]\*\*\* | never[]               | never[]                                                                                                            | never[]                                      |
| firestore.GeoPoint[]             | firestore.GeoPoint[]  | firestore.GeoPoint[]                                                                                               | firestore.GeoPoint[]                         |
| object[]\*\*                     | object[]              | object[]                                                                                                           | object[]                                     |
| n-dimension array                | n-dimension array     | n-dimension array \| FirebaseFirestore.FieldValue(arrayRemove/arrayUnion\*) only supported for 1st dimension array | compare only elements in 1st dimension array |

you can union any types, it will generate the types distributively, for example type `string | number | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]` generates:

read type: `string | number | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]`

write type: `string | number | FirebaseFirestore.FieldValue | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]`

compare type: `string | number | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]`

In practice, any union is not recommended, data should has only one type, except `undefined` or `null` union that bear certain meaning(value missing or never initialized).

NOTE: `Date | firestore.Timestamp`, `(Date | firestore.Timestamp)[]`, and `Date[] | firestore.Timestamp[]` unions are redundant, because `Date` and `firestore.Timestamp` generate same `read`, `write` and `compare` types.

\* Any FirebaseFirestore.FieldValue type will be replaced by masked type, see [Handling Firestore Field Value: Masking](#-handling-firestore-field-value-masking) for more info.

\*\* object type refer to object literal type(typescript) or map type(firestore). The wrapper flatten nested object, however, there are not many things to do with object[] type due to how firestore work, read [Complex Data Typing](#-complex-data-typing) for more info.

\*\*\* `Firelord.ServerTimestamp` is a reserved type. You cannot use it as a string literal type, use this type if you want your type to be `Firestore.ServerTimestamp`. Also do note that you cannot use serverTimestamp or any firestore field value in array, see [Complex Data Typing](#-complex-data-typing) for more info.

## 🐘 Document operations: Write, Read and Listen

All the document operations API is like firestore [write](https://firebase.google.com/docs/firestore/manage-data/add-data), [read](https://firebase.google.com/docs/firestore/query-data/get-data) and [listen](https://firebase.google.com/docs/firestore/query-data/listen).

```ts
// import user

import { firestore } from 'firebase-admin'

// get data(type is `read type`)
user.get().then(snapshot => {
	const data = snapshot.data()
})

// listen to data(type is `read type`)
user.onSnapshot(snapshot => {
	const data = snapshot.data()
})

const ServerTimestamp = firestore.FieldValue.ServerTimestamp()

// create if only exist, else fail
// require all `write type` members(including partial member in the `base type`) except `updatedAt` and `createdAt`
// auto add `createdAt` and `updatedAt`
user.create({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: ServerTimestamp,
	beenTo: ['RUSSIA'],
})

// create if not exist, else overwrite
// although it can overwrite, we intend this to use as create
// require all `write type` members(including partial member in the `base type`) except `updatedAt` and `createdAt`
// auto add `createdAt` and `updatedAt`
user.set({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: ServerTimestamp,
	beenTo: ['RUSSIA'],
})

// create if not exist, else update
// although it can create if not exist, we intend this to use as an update operation
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` in the `base type`
// auto update `updatedAt`
// the only value for `merge` is `true`
// NOTE: there will be a missing property error from typescript if all the members are not present. To fix this, just fill in `{ merge: true }` in the option, as shown below.
user.set({ name: 'Michael' }, { merge: true })

// create if not exist, else update
// although it can create if not exist, we intend this to use as an update operation
// all members are partial members, you can leave any of the members out, however, typescript will stop you from explicitly assigning `undefined` value to any of the members unless you union the type with `undefined` in the `base type`
// auto update `updatedAt`
// the only value for `merge` is `true`
// NOTE: there will be a missing property error from typescript if all the members are not present. To fix this, just fill in `{ mergeField: fieldPath[] }` in the option, as shown below.
user.set(
	{ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) },
	{ mergeField: ['name', 'age'] } // update only `name` and `age` fields
)

// update if exist, else fail
// all members are partial members, you can leave any of the members out, however, typescript will stop you from explicitly assigning `undefined` value to any of the members unless you union the type with `undefined` in the `base type`
// auto update `updatedAt`
user.update({ name: 'Michael' })

// delete document
user.delete()
```

## 🦩 Document operations: Batch

all API are similar to [firestore batch](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes), the only difference is, the batch is member of doc, hence you don't need to define document reference.

```ts
// import user
import { firestore } from 'firebase-admin'

// implement the wrapper
const user = wrapper<User>().col('Users').doc('1234567890')

// create batch
const batch = firestore().batch()
const userBatch = user.batch(batch)

// delete document
userBatch.delete()

// create if exist, else fail
// require all `write type` members(including partial member in the `base type`) except `updatedAt` and `createdAt`
// auto add `updatedAt` and `createdAt`
userBatch.create({ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) })

// create if not exist, else overwrite
// although it can overwrite, we intend this to use as create
// require all `write type` members(including partial member in the `base type`) except `updatedAt` and `createdAt`
// auto add `createdAt` and `updatedAt`
userBatch.set({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: ServerTimestamp,
	beenTo: ['RUSSIA'],
})

// create if not exist, else update
// although it can create if not exist, we intend this to use as an update operation
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` in the `base type`
// auto update `updatedAt`
// the only value for `merge` is `true`
// NOTE: there will be a missing property error from typescript if all the members are not present. To fix this, just fill in `{ merge: true }` in the option, as shown below.
userBatch.set({ name: 'Michael' }, { merge: true })

// create if not exist, else update
// although it can create if not exist, we intend this to use as an update operation
// all members are partial members, you can leave any of the members out, however, typescript will stop you from explicitly assigning `undefined` value to any of the members unless you union the type with `undefined` in the `base type`
// auto update `updatedAt`
// the only value for `merge` is `true`
// NOTE: there will be a missing property error from typescript if all the members are not present. To fix this, just fill in `{ mergeField: fieldPath[] }` in the option, as shown below.
userBatch.set(
	{ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) },
	{ mergeField: ['name', 'age'] } // update only `name` and `age` fields
)

// update if exist, else fail
// all members are partial members, you can leave any of the members out, however, typescript will stop you from explicitly assigning `undefined` value to any of the members unless you union the type with `undefined` in the `base type`
// auto update `updatedAt`
userBatch.update({ name: 'Ozai' })

//commit
batch.commit()
```

## 🐠 Document Operations: Transaction

all API is like [firestore transaction](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes), the only difference is, the batch is a member of doc, hence you don't need to define document reference.

```ts
// import user

user.runTransaction(async transaction => {
	// get `read type` data
	await transaction.get().then(snapshot => {
		const data = snapshot.data()
	})

	// create if only exist, else fail
	// require all `write type` members(including partial member in the `base type`) except `updatedAt` and `createdAt`
	// auto add `createdAt` and `updatedAt`
	await transaction.create({
		name: 'John',
		age: 24,
		birthday: new Date(1995, 11, 17),
		joinDate: ServerTimestamp,
		beenTo: ['RUSSIA'],
	})

	// create if not exist, else overwrite
	// although it can overwrite, we intended this to use as create
	// require all `write type` members(including partial member in the `base type`) except `updatedAt` and `createdAt`
	// auto add `createdAt` and `updatedAt`
	user.set({
		name: 'John',
		age: 24,
		birthday: new Date(1995, 11, 17),
		joinDate: ServerTimestamp,
		beenTo: ['RUSSIA'],
	})

	// create if not exist, else update
	// although it can create if not exist, we intend this to use as an update operation
	// all members are partial members, you can leave any of the members out, however, typescript will stop you from explicitly assigning `undefined` value to any of the members unless you union the type with `undefined` in the `base type`
	// auto update `updatedAt`
	// the only value for `merge` is `true`
	// NOTE: there will be a missing property error from typescript if all the members are not present. To fix this, just fill in `{ merge: true }` in the option, as shown below.
	await transaction.set({ name: 'Michael' }, { merge: true })

	// create if not exist, else update
	// although it can create if not exist, we intend this to use as an update operation
	// all members are partial members, you can leave any of the members out, however, typescript will stop you from explicitly assigning `undefined` value to any of the members unless you union the type with `undefined` in the `base type`
	// auto update `updatedAt`
	// the only value for `merge` is `true`
	// NOTE: there will be a missing property error from typescript if all the members are not present. To fix this, just fill in `{ mergeKey: fieldPath[] }` in the option, as shown below.
	await transaction.set(
		{ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) },
		{ mergeField: ['name', 'age'] } // update only `name` and `age` fields
	)

	// update if exist, else fail
	// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union the type with `undefined` in the `base type`
	// auto update `updatedAt`
	await transaction.update({ name: 'Michael' })
	// delete document
	await transaction.delete()

	// keep in mind you need to return a promise in transaction
	// example code here is just an example to show API, this is not the correct way to do it
	// refer firestore guide https://firebase.google.com/docs/firestore/manage-data/transactions
	return Promise.resolve('')
})
```

## 🌞 Collection Operations: Query

All the API are like [firestore query](https://firebase.google.com/docs/firestore/query-data/queries), clauses are chain-able.

```ts
// import users

// non array data type
// the field path is the keys of the `base type`
// type of opStr is '<' | '<=' | '==' | '!=' | '>=' | '>' | 'not-in' | 'in'
// if type of opStr is '<' | '<=' | '==' | '!=' | '>=' | '>', the value type is same as the member's type in `compare type`
users.where('name', '==', 'John').get()
// if type of opStr is 'not-in' | 'in', the value type is array of member's type in `compare type`
users.where('name', 'in', ['John', 'Michael']).get()

// array data type
// the field path is the keys of the `base type`
// type of `opStr` is  'in' | 'array-contains-any'
// if type of opStr is 'array-contains', the value type is the non-array version of member's type in `compare type`
users.where('beenTo', 'array-contains', 'USA').get()
// if type of opStr is 'array-contains-any', the value type is same as the member's type in `compare type`
users.where('beenTo', 'array-contains-any', ['USA']).get()
// if type of opStr is 'in', the value type is the array of member's type in `compare type`
users.where('beenTo', 'in', [['CANADA', 'RUSSIA']]).get()
```

## 🐳 Collection Operations: Order And Limit

all the API are like [firestore order and limit](https://firebase.google.com/docs/firestore/query-data/queries) with slight differences, but work the same, clauses are chain-able.

The type rule obey firestore [orderBy limitation](https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations).

Read this before proceeding: [Firestore OrderBy and Where conflict](https://stackoverflow.com/a/56620325/5338829) and [firestore index](https://www.fullstackfirebase.com/cloud-firestore/indexes) on how to overcome certain `orderBy` limitation, this is also considered into typing.

Any `orderBy` that does not follow `where` clause does not abide by the rule and limitation mentioned above.

Note: The wrapper will not stop you from using multiple `orderBy` clause because multiple `orderBy` clause is possible, read [Multiple orderBy in firestore](https://stackoverflow.com/a/66071503/5338829) and [Ordering a Firestore query on multiple fields](https://cloud.google.com/firestore/docs/samples/firestore-query-order-multi).

Tips: to make things easier, whenever you want to use `where` + `orderBy`, use the shorthand form (see example code below).

```ts
// import users

// the field path is the keys of the `compare type`(basically keyof `base type` plus `createdAt` and `updatedAt`)

// if the member value type is array, type of `opStr` is  'in' | 'array-contains'| 'array-contains-any'
// if type of opStr is 'array-contains', the value type is the non-array version of member's type in `compare type`
users.where('beenTo', 'array-contains', 'USA').get()
// if type of opStr is 'array-contains-any', the value type is same as the member's type in `compare type`
users.where('beenTo', 'array-contains-any', ['USA']).get()
// if type of opStr is 'in', the value type is the array of member's type in `compare type`
users.where('beenTo', 'in', [['CANADA', 'RUSSIA']]).get()

// orderBy field path only include members that is NOT array type in `compare type`
users.orderBy('name', 'desc').limit(3).get()

// for `array-contains` and `array-contains-any` comparators, you can chain `orderBy` clause with DIFFERENT field path
users.where('beenTo', 'array-contains', 'USA').orderBy('age', 'desc').get()
users
	.where('beenTo', 'array-contains-any', ['USA', 'CHINA'])
	.orderBy('age', 'desc')
	.get()

// for '==' | 'in' comparators:
// no order for '==' | 'in' comparator for SAME field name, read https://stackoverflow.com/a/56620325/5338829 before proceed
users.where('age', '==', 20).orderBy('age', 'desc').get()
// '==' | 'in' is order-able with DIFFERENT field name but need to use SHORTHAND form to ensure type safety
users.where('age', '==', 20).orderBy('name', 'desc').get()
// shorthand ensure type safety, equivalent to where('age', '>', 20).orderBy('name','desc')
users.where('age', '==', 20, { fieldPath: 'name', directionStr: 'desc' }).get()
// again, no order for '==' | 'in' comparator for SAME field name
users.where('age', '==', 20, { fieldPath: 'age', directionStr: 'desc' }).get()

// for '<' | '<=]| '>'| '>=' comparator
// no order for '<' | '<=]| '>'| '>=' comparator for DIFFERENT field name
users.where('age', '>', 20).orderBy('name', 'desc').get()
// '<' | '<=]| '>'| '>=' is oder-able with SAME field name but need to use SHORTHAND form to ensure type safety
users.where('age', '>', 20).orderBy('age', 'desc').get()
// equivalent to where('age', '>', 20).orderBy('age','desc')
users.where('age', '>', 20, { fieldPath: 'age', directionStr: 'desc' }).get()
// again, no order for '<' | '<=]| '>'| '>=' comparator for DIFFERENT field name
users.where('age', '>', 20, { fieldPath: 'name', directionStr: 'desc' }).get()

// for `not-in` and `!=` comparator, you can use normal and  shorthand form for both same and different name path
// same field path
users.where('name', 'not-in', ['John', 'Ozai']).orderBy('name', 'desc').get()
// different field path
users.where('name', 'not-in', ['John', 'Ozai']).orderBy('age', 'desc').get()
// shorthand different field path:
users
	.where('name', 'not-in', ['John', 'Ozai'], {
		fieldPath: 'age',
		directionStr: 'desc',
	})
	.get() // equivalent to where('name', 'not-in', ['John', 'Ozai']).orderBy('age','desc')
// shorthand same field path:
users
	.where('name', 'not-in', ['John', 'Ozai'], {
		fieldPath: 'name',
		directionStr: 'desc',
	})
	.get() // equivalent to where('name', 'not-in', ['John', 'Ozai']).orderBy('name','desc')

// same field path
users.where('name', '!=', 'John').orderBy('name', 'desc').get()
// different field path
users.where('name', '!=', 'John').orderBy('age', 'desc').get()
// shorthand different field path:
users
	.where('name', '!=', 'John', {
		fieldPath: 'age',
		directionStr: 'desc',
	})
	.get() // equivalent to where('name', '!=', 'John').orderBy('age','desc')
// shorthand same field path:
users
	.where('name', '!=', 'John', {
		fieldPath: 'name',
		directionStr: 'desc',
	})
	.get() // equivalent to where('name', '!=', 'John').orderBy('name','desc')
```

## 🌺 Collection Operations: Paginate And Cursor

API differ slightly from [firestore paginate and cursor](https://firebase.google.com/docs/firestore/query-data/query-cursors), the cursors became orderBy parameter, it still works the same as firestore original API, clauses are chain-able.

```ts
// import users

// field path only include members that is NOT array type in the `base type`
// field value type is the corresponding field path value type in `compare type`
// value of cursor clause is 'startAt' | 'startAfter' | 'endAt' | 'endBefore'
users.orderBy('age', 'asc', { clause: 'startAt', fieldValue: 20 }).offset(5) // equivalent to orderBy("age").startAt(20).offset(5)
// usage with where
users
	.where('name', '!=', 'John')
	.orderBy('age', 'desc', { clause: 'endAt', fieldValue: 50 })
// equivalent to shorthand
users
	.where('name', '!=', 'John', {
		fieldPath: 'age',
		directionStr: 'desc',
		cursor: { clause: 'endAt', fieldValue: 50 },
	})
	.get() // equivalent to where('name', '!=', 'John').orderBy('age','desc').endAt(50)
```

## 🌵 Collection Group

Api is exactly the same as Collection Operations: [Query](#-collection-operations-query), [Order And Limit](#-collection-operations-order-and-limit), [Paginate And Cursor](Firelord#-collection-operations-paginate-and-cursor)

simply use collection group reference instead of collection reference, refer back [Getting Started](#-getting-started) on how to create collection group reference.

## 🌻 Complex Data Typing

As for (nested or not)object[] type, its document/collection operations work the same as other arrays: it will not flatten down due to how firestore work, read [Firestore how to query nested object in array](https://stackoverflow.com/a/52906042/5338829). You cannot query(or set, update, etc) specific object member or array member in the array, nested or not, similar rule applies to a nested array.

Long thing short, any data type that is in an array, be it another array or another object with array member:

1. will not get flattened and will not have its field path built nor you can use field value (arrayRemove, arrayUnion and increment, serverTimestamp). Read [Firestore append to array (field type) an object with server timestamp](https://stackoverflow.com/a/66353116/5338829) and [How to increment a map value in a Firestore array](https://stackoverflow.com/a/58310449/5338829), both are negative.
2. unable to skip any member, object must have exact shape. If you need undefined, assign undefined to the member in the `base type` instead.

However, it is possible to query or write a specific object member (nested or not), as long as it is not in an array, the typing logic works just like other primitive data types' document/collection operation because the wrapper will flatten all the members in object type, nested or not.

NOTE: `read` type does not flatten, because there is no need to.

Last, all the object, object[], array, array object, nested or not, no matter how deep, all the field values (not specifically referring to Firestore.FieldValue) of all data types will undergo data type conversion according to the [conversion table](#-conversion-table).

consider this example

```ts
// import Firelord
// import wrapper

type Nested = Firelord.ReadWriteCreator<
	{
		a: number
		b: { c: string }
		d: { e: { f: Date[]; g: { h: { i: { j: Date }[] }[] } } }
	},
	'Nested',
	string
>
const nested = wrapper<Nested>().col('Nested')

// read type, does not flatten because no need to
type NestedRead = Nested['read'] // {a: number, b: { c: string }, d: { e: { f: FirebaseFirestore.Timestamp[], g: { h: { i: {j: firestore.Timestamp}[] }[] } } }	}
// write type
type NestedWrite = Nested['write'] // {a: number | FirebaseFirestore.FieldValue, "b.c": string, "d.e.f": FirebaseFirestore.FieldValue | (FirebaseFirestore.Timestamp | Date)[], "d.e.g.h": FirebaseFirestore.FieldValue | { i: {j: firestore.Timestamp | Date}[] }[], createdAt: FirebaseFirestore.FieldValue, updatedAt: FirebaseFirestore.FieldValue}
// compare type
type NestedCompare = Nested['compare'] // {a: number, "b.c": string, "d.e.f": (FirebaseFirestore.Timestamp | Date)[], "d.e.g.h": FirebaseFirestore.FieldValue | { i: {j: firestore.Timestamp | Date}[] }[], createdAt: Date | firestore.Timestamp, updatedAt: Date | firestore.Timestamp}
```

As you can see, the object flattens down and the wrapper converted all the value types

so the next question is, how are you going to shape your object so you can use it in `set`, `create` and `update` operation?

## Set, Create and Add

Please read [set and dot syntax](https://stackoverflow.com/a/60879213/5338829) before you proceed.

In short, you cannot use dot syntax with `set` (`create` should have the same behaviour, need more clarification).

consider this example:

```ts
// import nested
const completeData = {
	a: 1,
	b: { c: 'abc' },
	d: { e: { f: [new Date(0)], g: { h: [{ i: [{ j: new Date(0) }] }] } } },
}
const data = {
	a: 1,
	d: { e: { f: [new Date(0)], g: { h: [{ i: [{ j: new Date(0) }] }] } } },
}

nested.doc('123456').set(completeData) // set needs complete data if no merge option
nested.doc('123456').create(completeData) // create also requires complete data
nested.add(completeData) // add also requires complete data
nested.doc('123456').set(data, { merge: true })
```

### Update

Please read [Cloud Firestore: Update fields in nested objects with dynamic key](https://stackoverflow.com/a/47296152/5338829) before you proceed,

Yes, `update` can use dot syntax to update specific fields.

consider this example:

```ts
// import nested

const data = {
	a: 1,
	d: { e: { f: [new Date(0)], g: { h: [{ i: [{ j: new Date(0) }] }] } } },
}

nested.doc('123456').update(data) // ERROR, type mismatch, if your data is nested object, please flatten your data first
```

If you want to update fields in nested objects, there are 2 ways:

1. create the flattened object by yourself.
2. use helper function: import `flatten` from `firelord`. (recommended, because it is easier)

Reminder:

1. you don't need to flatten non-nested object, but nothing will happen if you accidentally did it.
2. `update` does not require all members to exist, it will simply update that particular field.

solution:

```ts
// import nested

import { flatten } from 'firelord'

// flatten by yourself(?)
const flattenedData = {
	a: 1,
	'd.e.f': [new Date(0)],
	'd.e.g.h': [{ i: [{ j: new Date(0) }] }],
}

nested.doc('123456').update(flattenedData) // ok

// use helper function
const data = {
	a: 1,
	d: { e: { f: [new Date(0)], g: { h: [{ i: [{ j: new Date(0) }] }] } } },
}
nested.doc('123456').update(flatten(data)) // ok, recommended, because it is easier
```

As for query, since the type is flattened, just query like you would normally query in firelord.

That is all. Call `flatten` to flatten the complex data and the rest work just like simple data, clean and simple.

## Handling Firestore Field Value: Masking

Firestore field value, aka serverTimestamp, arrayRemove, arrayUnion and increment, they all return `FieldValue`, this is problematic, as you may use increment on an array or serverTimeStamp on a number. Kudo to whoever design this for making our life harder.

The wrapper forbids you to use any firestore field value(serverTimestamp, arrayRemove, arrayUnion and increment) instance. We prepare another field value generator for you with the return type masked.

It still returns the same firestore field value but with a masked return type, conversion table below shows what mask the types.

| Field Value     | Masked Type                                                                                 | Note                              |
| --------------- | ------------------------------------------------------------------------------------------- | --------------------------------- |
| increment       | { 'please import `increment` from `firelord` and call it': number }                         |
| serverTimestamp | { 'please import `serverTimestamp` from `firelord` and call it': Firelord.ServerTimestamp } |
| arrayUnion      | { 'please import `arrayUnion` or `arrayRemove` from `firelord` and call it': T }            | where T is the type of the member |
| arrayRemove     | { 'please import `arrayUnion` or `arrayRemove` from `firelord` and call it': T }            | where T is the type of the member |

the mask types purposely looks weird, so nobody accidentally uses it for something else(as it could be dangerous, because the underneath value is firestore field value, not what typescript really think it is).

this is how you use it

```ts
// import Firelord
// import wrapper
const { increment, arrayUnion, serverTimestamp } = wrapper().fieldValue

type HandleFieldValue = Firelord.ReadWriteCreator<
	{
		aaa: number
		bbb: Firelord.ServerTimestamp
		ddd: string[]
	},
	'HandleFieldValue',
	string
>

const handleFieldValue = wrapper<HandleFieldValue>().col('HandleFieldValue')

handleFieldValue.doc('1234567').set({
	aaa: arrayUnion('123', '456'), // ERROR
	bbb: increment(11), // ERROR
	ddd: arrayUnion(123, 456), // ERROR
})

handleFieldValue.doc('1234567').set({
	aaa: increment(1), // ok
	bbb: serverTimestamp(), // ok
	ddd: arrayUnion('123', '456'), // ok
})
```

The API is like firestore API, same working logic apply to complex data type.

if you try to use the original firestore field value, the wrapper will stop you.

## 🐕 Opinionated Elements

Code wise, there is one opinionated element in the wrapper, that is `createdAt` and `updatedAt` timestamp that add or update automatically.

when a document is created via `add`, `create` or `set` without option, two things will happen:

1. createdAt field path is created, and the value is firestore server timestamp(current server timestamp).
2. updatedAt field path is created, and the value is `null`.

when a document is updated via `update` or `set` with option:

1. updatedAt field path is updated and the value is firestore server timestamp.

This behaviour may be undesirable for some people. I will improve this in future by giving the developer choice.

Typing wise, there are few opinionated elements:

1. `set`(without option) and `create` operations require all member to present.
2. all write operations reject stranger members.
3. although `updatedAt` and `createdAt` is included in type, all write operation exclude them, which mean you cant write the value of `updatedAt` and `createdAt`.

I believe this decision is practical for cases and not planning to change it in the forseeable future.

## 🐇 Limitation

While the wrapper try to safeguard as much type as possible, some problem cannot be solved due to typing difficulty, or require huge effort to implement, or straight up not can be solved.

1. despite being able to type [orderBy limitation](https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations), there is no type-safe measurement for [Query Limitation](https://firebase.google.com/docs/firestore/query-data/queries) because the number of `where` clause is unforeseeable.
2. `Firelord.ServerTimestamp` is a reserved type, underneath it is a string and you cannot use it as a string literal type. Use it when only you need the serverTimestamp type.
3. All mask types are passive reserved types, you cannot use them as object type nor use them for any purpose(the wrapper will turn mask types into `never` if you use them).

## 💍 Utility

Since write operations reject stranger members (member that are not defined in base type), you can use [object-exact](https://www.npmjs.com/package/object-exact)(I am the author) to remove the stranger members, the library returns the exact type, so it should work well with the wrapper.

Do not use `flatten` for other purposes. If you need it, see [object-flat](https://www.npmjs.com/package/object-flat)(I am the author), it is a general purpose library. Do not use `object-flat` in firelord as it is not specifically tailored for firelord, use firelord native `flatten` instead.

## 🐬 Advices

### Array

_You can ≠ You should_

Although the wrapper can handle virtually any complex data type, it doesn't mean you should model the data in such a way, especially when dealing with the array.

When dealing with an array, avoid:

- array of objects
- array of arrays

not only data types are hard to query and hard to massage, but they also pose great difficulty to security rule, especially if the permission is relying on the data.

Use array on primitive data types, or timestamp and geo point(objects that have consistent structure).

Theoretically speaking, it is possible to create a flat structure for all kinds of data types, but this is harder to be done in firestore because your data model affects the pricing, firestore incentives you to put more data in the same document, hence you see all kind of array of objects and array of arrays data types.

Anyway, do not resort to complex data types easily. Always keep your data type straightforward if possible.

### Nested Object

In firestore, nested object working logic is like a flat object, as long as you get the path right, you can query and write them with no issue. A nested object is fine, as long as you structure it in how a human mind can easily comprehend it, eg do not nest too deep.

### Do Not Bother Cost Focus Data Modelling

Firestore may look simple, but it is incredibly difficult to model especially if you aim to save as much as cost as possible, that is aggregating your data. My advice is, do not bother, it increases your project complexity, and it doesn't worth the time and money to aggregate the data.

So don't do it.

However, if aggregation can save you a significant amount of money(assuming you already model your data correctly), chances are, you are probably not using the right database, use other databases (PSQL or MongoDB), it is much better and easier in terms of cost handling.

### One Collection One Document Type

It is possible to have multiple document types under the same collection. For example, under a `User` collection, you may be tempted to create `profile` and `setting`(`User/{userId}/Account/[profile and setting]`) documents in it. Or you may create two collections under `User` that contains only a single document:`User/{userId}/Profile/profile` and `User/{userId}/Setting/Setting`.

I would recommend instead of creating `profile` and `setting`, you create two top collections: `profile` and `setting` that contain all user profiles and settings instead.

Logically, there should be one type of document in on collection(hence the name `collections`).

But in the end, both should work fine. There are some considerations behind this but it doesn't matter much. Use whatever you like, even so, I would recommend creating top collections for a more logical structure.

## 🦎 Caveats

Because of the heavy use of generic types and utility types, typescript hints may look chaotic. However, there is no need to be panic. Simply check your data type carefully. The wrapper priority is to make sure you cannot go wrong.

## 🐎 Road Map

- automate flatten (difficult).
