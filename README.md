<!-- markdownlint-disable MD010 -->

# firelord(BETA, Nodejs ONLY)

[![npm](https://img.shields.io/npm/v/firelord)](https://www.npmjs.com/package/firelord) [![GitHub](https://img.shields.io/github/license/tylim88/firelord)](https://github.com/tylim88/firelord/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/tylim88/firelord/pulls)

🐤 Deep admin firestore typing wrapper.

🚀 All read and write operation are typed, field key, field value, collection path, document path, all typed!

🔥 Automatically convert base type to corresponding read and write time(good at handling timestamp and field value).

✨ Api closely resemble firestore api, low learning curve.

⛲️ Out of box typescript support.

## 🦙 Purpose

Even though we can define type for read and write with firestore `withConverter`, however this solve only small portion of the types problem, and there is still no feasible solutions to deal with type like date, firestore.Timestamp, number and array where the read and write are different. This library is a wrapper that introduce deeper typing solution.

Not only this library deal with data type, it also keep your collection path and document path safe.

require typescript 4.1 and above

Overview:

- generate read(get operation), write type(set/update operation) and compare type(for query) for field value, example:
  - server timestamp: `{write: Firestore.FieldValue, read: Firestore.Timestamp, compare: Date | Firestore.Timestamp}`
  - number: `{write: FieldValue | number, read: number, compare:number}`
  - xArray: `{write: x[] | FieldValue, read: x[], compare: never}`
- Typed collection path and document path.
- auto generate sub collection path.
- auto add both `updatedAt` and`createdAt` to the type.
- auto add `updatedAt` server timestamp to **all write** operation.
- auto add `createdAt` server timestamp to **create** operation.

basically all read operation return `read type` data, and all write operation will require `write type` data

the documentation explains how the types work, the library itself is intuitive in practice, thoroughly refer to the documentation only if you want to understand how the type work.

## 👟 Getting Started

```bash
npm i firelord
```

```ts
import { firelord, FireLord } from 'firelord'
import { firestore } from 'firebase-admin'

// use base type to generate read and write type
type User = FireLord.ReadWrite<
	{
		name: string
		age: number
		birthday: Date
		joinDate: 'ServerTimestamp'
		beenTo: ('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[]
	}, // base type
	'Users', // collection path type
	string // document path type
>

// read type
type UserRead = User['read'] // {name: string, age:number, birthday:firestore.Timestamp, joinDate: firestore.Timestamp, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[], createdAt:'ServerTimestamp', updatedAt:'ServerTimestamp'}

// write type
type UserWrite = User['write'] // {name: string, age:number|FirebaseFirestore.FieldValue, birthday:firestore.Timestamp | Date, joinDate:FirebaseFirestore.FieldValue, beenTo:('USA' | 'CANADA' | 'RUSSIA' | 'CHINA')[] | FirebaseFirestore.FieldValue, createdAt:'ServerTimestamp', updatedAt:'ServerTimestamp'}

// implement the wrapper
const users = firelord<User>().col('Users') // the only value for col is "Users"
const user = users.doc('1234567890') // document path is string

// subCollection of User
type Transaction = FireLord.ReadWrite<
	{
		amount: number
		date: 'ServerTimestamp'
		status: 'Fail' | 'Success'
	}, // base type
	'Transactions', // collection path type
	string, // document path type
	User // insert parent collection, it will auto construct the collection path for you
>

// implement the wrapper
const transactions = firelord<Transaction>().col('Users/283277782/Transactions') // the type for col is `User/${string}/Transactions`
const transaction = users.doc('1234567890') // document path is string
```

## 🦔 Conversion Table

| Base                  | Read                  | Write                                                                                                                                               | Compare                                   |
| --------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| number                | number                | number \| FirebaseFirestore.FieldValue (firestore.FieldValue.increment\*)                                                                           | number                                    |
| string                | string                | string                                                                                                                                              | string                                    |
| null                  | null                  | null                                                                                                                                                | null                                      |
| undefined             | undefined             | undefined                                                                                                                                           | undefined                                 |
| Date                  | firestore.Timestamp   | firestore.Timestamp \|Date                                                                                                                          | firestore.Timestamp \|Date                |
| firestore.Timestamp   | firestore.Timestamp   | firestore.Timestamp \|Date                                                                                                                          | firestore.Timestamp \|Date                |
| 'ServerTimestamp'     | firestore.Timestamp   | FirebaseFirestore.FieldValue (firestore.FieldValue.serverTimestamp*) \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion*)   | firestore.Timestamp \|Date                |
| object                | not supported\*\*     | not supported\*\*                                                                                                                                   | not supported\*\*                         |
| number[]              | number[]              | number[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*)                                                              | number[]                                  |
| string[]              | string[]              | string[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*)                                                              | string[]                                  |
| null[]                | null[]                | null[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*)                                                                | null[]                                    |
| undefined[]           | undefined[]           | undefined[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*)                                                           | undefined[]                               |
| 'ServerTimestamp'[]   | firestore.Timestamp[] | FirebaseFirestore.FieldValue (firestore.FieldValue.serverTimestamp*)[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion*) | (Date \| firestore.Timestamp)[]           |
| Date[]                | firestore.Timestamp[] | (firestore.Timestamp \|Date )[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*)                                       | (Date \| firestore.Timestamp)[]           |
| firestore.Timestamp[] | firestore.Timestamp[] | (firestore.Timestamp \|Date )[] \|FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*)                                       | (Date \| firestore.Timestamp)[]           |
| object[]              | not supported\*\*     | not supported\*\*                                                                                                                                   | not supported\*\*                         |
| n-dimension array     | n-dimension array     | n-dimension array \| FirebaseFirestore.FieldValue(firestore.FieldValue.arrayRemove/arrayUnion\*) only supported for 1st dimension                   | n-dimension array (need more information) |

you can union any types, it will generates the types distributively, eg `string | number | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][]` yield `{ read: string | number | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][], write: string | number | FirebaseFirestore.FieldValue | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][], compare: string | number | number[] | (string | number)[] | (string | number)[][] | (string | number)[][][] }`

NOTE: you dont need to union `Date | firestore.Timestamp` or `(Date | firestore.Timestamp)[]`, you can but it is redundant, because `Date` and `firestore.Timestamp` yield same `read` and `write` type.

\*I am not able to narrow down FirebaseFirestore.FieldValue, you might end up using increment on array or assign server time stamp on number or array union number onto string array field, solution is welcomed.
\*\*It is not totally impossible to deal with object type, however it is too painful to deal with right now, any elegant solution is welcomed. Personally I do not recommend storing object type, primitive data type can do thing just fine and easier to deal with.

## 🎵 Document operations: Write, Read and Listen

all the document operations api is similar to firestore [write](https://firebase.google.com/docs/firestore/manage-data/add-data), [read](https://firebase.google.com/docs/firestore/query-data/get-data) and [listen](https://firebase.google.com/docs/firestore/query-data/listen).

```ts
// import user

user.get(snapshot => {
	const data = snapshot.data()
})

user.onSnapshot(snapshot => {
	const data = snapshot.data()
})

const serverTimestamp = firestore.FieldValue.serverTimestamp()

// create if only exist, else fail
// require all members in `write type` except `updatedAt` and `createdAt`
// auto add `createdAt` and `updatedAt`
user.create({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: serverTimestamp,
	beenTo: ['RUSSIA'],
})

// create if not exist, else overwrite
// although it can overwrite, this is intended to use as create
// require all members in `write type` except `updatedAt` and `createdAt`
// auto add `createdAt` and `updatedAt`
user.set({
	name: 'John',
	age: 24,
	birthday: new Date(1995, 11, 17),
	joinDate: serverTimestamp,
})

// create if not exist, else update
// although it can create if not exist, this is intended to use as update
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union it in `base type`
// auto update `updatedAt`
// the only value for `merge` is `true`
// NOTE: there will be typescript missing property error if all member is not present, to fix this just fill in `{ merge:true }` in option as shown below.
user.set({ name: 'Michael' }, { merge: true })

// create if not exist, else update
// although it can create if not exist, this is intended to use as update
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union it in `base type`
// auto update `updatedAt`
// the merge keys are keys of `base type`
// NOTE: there will be typescript missing property error if all member is not present, to fix this just fill in `mergeField: [<keys>]` in option as shown below.
user.set(
	{ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) },
	{ mergeField: ['name', 'age'] } // update only `name` and `age` fields
)

// update if exist, else fail
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union it in `base type`
// auto update `updatedAt`
user.update({ name: 'Michael' }, { merge: true })
```

## 🦩 Batch Operation

all the api are similar to [firestore](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes), the only difference is, the batch is member of doc.

```ts
// import user

// implement the wrapper
const user = firelord<User>().col('Users').doc('1234567890')

// create batch
const batch = firestore().batch() // useful for any case
const userBatch = user.batch(batch)

// delete document
userBatch.delete()

// create if exist, else fail
// require all members in `write type` except `updatedAt` and `createdAt`
// auto add `updatedAt` and `createdAt`
userBatch.create({ name: 'Michael', age: 32, birthday: new Date(1987, 8, 9) })

// update if exist, else fail
// all member are partial members, you can leave any of the member out, however typescript will stop you from explicitly assign `undefined` value to any of the member unless you union it in `base type`
// auto update `updatedAt`
userBatch.update({ name: 'Ozai' })

//commit
batch.commit()
```

## 🌞 Collection Operations: Query

all the api are similar to [firestore](https://firebase.google.com/docs/firestore/query-data/queries), clauses are chain-able.

```ts
// import Users

// the field path is the keys of the `compare type`
// if the member value is non array, type of opStr is '<' | '<=' | '==' | '!=' | '>=' | '>' | 'not-in' | 'in'
// if type of opStr is '<' | '<=' | '==' | '!=' | '>=' | '>', the value type is same as the member's type in `compare type`
Users.where('name', '==', 'John').get()
// if type of opStr is 'not-in' | 'in', the value type is array of member's type in `compare type`
Users.where('name', 'in', ['John', 'Michael']).get()

// the field path is the keys of the `compare type`
// if the member value type is array, type of `opStr` is  'in' | 'array-contains-any'
// if type of opStr is 'array-contains', the value type is the non-array version of member's type in `compare type`
Users.where('beenTo', 'array-contains', 'USA').get()
// if type of opStr is 'array-contains-any', the value type is same as the member's type in `compare type`
Users.where('beenTo', 'array-contains-any', 'USA').get()
// if type of opStr is 'in', the value type is the array of member's type in `compare type`
Users.where('beenTo', 'in', [['CANADA', 'RUSSIA']]).get()
```

## 🐳 Collection Operations: Order And Limit

all the api are similar to [firestore](https://firebase.google.com/docs/firestore/query-data/queries) with slight different, but work the same, clauses are chain-able.

```ts
// import Users

// field path only include members that is NOT array type in `compare type`
Users.orderBy('name', 'desc').limit(3).get()
Users.where('age', '>', 20).orderBy('age', 'desc').get()

// this is invalid, first orderBy must have the same field as where clause with <, <=, >, >= comparators
// https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations
// due to `where` clause and `orderBy` clause individual usage, this is NOT preventable by typescript and will not trigger any typescript error
Users.where('age', '>', 20).orderBy('name', 'desc').get()
// this is also invalid according to firestore nor it make any sense
Users.where('age', '==', 20).orderBy('age', 'desc').get()
Users.where('age', 'in', [20, 30]).orderBy('age', 'desc').get()

// we prepare type safe shorthand to handle invalid case due to limitation
// for <, <=, >, >= comparators, the optional 4th parameter(orderBy config object) is available (else the 4th parameter's type is `never`)
// field value type is the corresponding field path value type in `compare type`
User.where('age', '>', 20, {}).get() // equivalent to where('age', '>', 20).orderBy('age')
User.where('age', '>', 20, { directionStr: 'desc' }).get() // equivalent to where('age', '>', 20).orderBy('age','desc')
User.where('age', '>', 20, {
	directionStr: 'desc',
	cursor: { clause: 'endAt', fieldValue: 50 },
}).get() // equivalent to where('age', '>', 20).orderBy('age','desc').endAt(50)

// for `not-in` comparator, optional `fieldPath` config member is available in the 4th parameter, (else the config member's type is `never`)
// if `fieldPath` is undefined, it will use the same `fieldPath` as where clause
// field value type is the corresponding field path value type in `compare type`
User.where('name', 'not-in', ['John', 'Ozai'], {
	fieldPath: 'age',
	directionStr: 'desc',
	cursor: { clause: 'endAt', fieldValue: 50 },
}).get() // equivalent to where('name', 'not-in', ['John', 'Ozai']).orderBy('age','desc').endAt(50)
```

## 🌺 Collection Operations: Paginate And Cursor

api are slightly different than [firestore](https://firebase.google.com/docs/firestore/query-data/query-cursors) but work the same, clauses are chain-able.

```ts
// import Users

// field path only include members that is NOT array type in `compare type`
// field value type is the corresponding field path value type in `compare type`
User.orderBy('age', { clause: 'startAt', fieldValue: 20 }) // equivalent to orderBy("age").startAt(20)
```
