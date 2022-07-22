# HISTORY

Change log

the change log now sync with https://github.com/tylim88/FirelordJS/blob/main/CHANGELOG.md starting v1.6.2

## 1.0.0 21-July-2022

- finally, V9 API!

## 0.17.10 1-2-2021

- rename write to writeFlatten
- rename writeNested to write

## 0.17.9 1-2-2021

- add ancestor key in ReadWriteCreator and MetaTypes, this key keep all ancestors in order

## 0.17.5 25-Nov-2021

- expose FirelordFirestore namespace

## 0.17.3 21-Nov-2021

- fix wrong onSnapshot and get interface on React Native and Web version
- fix update not working

## 0.17.0 20-Nov-2021

- simplify where and orderBy type logic and api
- further enhance orderBy limitation type safety(fix potential loophole)
- now you cant order the same field twice(new)

## 0.16.0 19-Nov-2021

- update now skip operation if the data is empty object

## 0.15.3 12-Nov-2021

- no longer need to explicitly type with Wrapper

## 0.15.0 12-Nov-2021

- change most explicit type to non function
- the firestore that query return in now wrapped by firelord
- rename Firelord to FirelordUtils
- rename FirelordWrapper to Firelord
- fix query's onSnapshot `QuerySnapshotCreator<T,'col'>` to `QuerySnapshotCreator<T, M>`

## 0.14.1 11-Nov-2021

- refactor some code

## 0.14.0 11-Nov-2021

- greatly reduce d.ts file size by explicitly typing the recursion function (before this only the return is type)
- reshape wrapper api so it makes more sense
- overall moderate changes

## 0.13.8 10-Nov-2021

- fix logic bug in where clause

## 0.13.0 10-Nov-2021

- solved Query limitation
- fix limit and limit to last missing M type

## 0.12.1 9-Nov-2021

- fix some minor type, missing 'colGroup' for M type

## 0.12.0 9-Nov-2021

- add solution for `not-in` 10 elements limitation, not completely solve it but it is the only solution
- querySnapshot docChanges document reference now properly typed
- no api changes.

## 0.11.0 9-Nov-2021

- `set` operation no longer auto-add or auto-update `createdAt` and `updatedAt` because it is impossible to know whether you are using this to create or to update.
- However `set` now accepts `createdAt`(Firelord.ServerTimestamp) and `updatedAt`(Firelord.ServerTimestamp | null) as data optionally, so you can decide on yourself how to use it.

## 0.10.3 9-Nov-2021

- expose `docPath` in MetaType

## 0.10.0 9-Nov-2021

- where "in" and "array-contains-any" now return array of query instead (this is to due with 10 element limit)
- "in", "not-in" and "array-contains-any" will automatic convert empty array to `[some random text]`
- improve array union and array remove api so they can deals with empty array
- create meta type to ease type duplication

## 0.9.4 6-Nov-2021

- Move onSnapshot to query

## 0.9.2 6-Nov-2021

- Move run transactional to outside
- add collection onSnapshot

## 0.9.1 2-Nov-2021

- fix bug where docID still cant receive undefined.

## 0.9.0 2-Nov-2021

- transaction now receive transaction as argument
- add transaction option argument for transaction (nodejs only)
- allow documentID to be empty so it will auto generate ID instead

## 0.8.0 1-Nov-2021

- rename `docPath` to `docId`
- rename `colGroupPath` to `colName`
- `ReadWriteCreator` now output `docID`, `docPath`, `colName`,`colPath`
- created `docSnapshot` function to wrap `documentSnapshot`
- wrap all documentSnapshot(lot of works)
- fix `getAll` parameter type
- rename file `flat` to `utils`
- `read` type now union with `undefined`
- revamp `QueryCreator`
- add new type `FirelordFirebase.DocumentChange` and `FirelordFirebase.QueryDocumentSnapshot`

## 0.7.4 30-Oct-2021

- fix missing batch's `set` operation.

## 0.7.3 30-Oct-2021

- `add` now return properly typed document reference

## 0.7.2 29-Oct-2021

- stop use from accidentally using mask types
- use longer string for 'ServerTimestamp' type to virtually reduce collision chance to 0

## 0.7.1 29-Oct-2021

- fix PartialNoImplicitUndefinedAndNoExtraMember not properly handle array and array field value

## 0.7.0 29-Oct-2021

- default value of `updatedAt` is `null` rather than `new Date(0)`.
- FirelordFirebase.CreatedUpdatedXXX type is now Firelord.CreatedUpdatedXXX

## 0.6.1 28-Oct-2021

- simplify queryCreator a bit

## 0.6.0 28-Oct-2021

- create DeepRequired type and implement it in FlattenObject
- add writeNested object type that return un-flatten form of write type
- reuse type for `flatten`
- fix `set` and create parameter type, `set` merge actually work different than update, `set` no longer accept flatten object
- no longer allow user to mark as optional in base type
- DeepRequire also recursive into array and object literal
- the `read`, `write` and `compare` type of `serverTimestamp[]` are now `never[]`
- remove `IncludeKeys` type as it is redundant
- fix forgot to convert `FirelordFirestore.Timestamp` in read converter
- `PartialNoImplicitUndefinedAndNoExtraMember` now recursive into object and array
- fix `set` type logic(the long one is better)

## 0.5.4 28-Oct-2021

- can no longer use serverTimestamp in array
- fix collection groupe path not working

## 0.5.2 28-Oct-2021

- compare type now also convert object in array recursively

## 0.5.0 27-Oct-2021

- solved firestore field value type unsafe issue by using masked type.
- the typescript hint of read and write now look more explicit

## 0.4.0 27-Oct-2021

- simpler solution for caveat 1 and 2,flatten no longer need 2nd argument

## 0.3.13 27-Oct-2021

- <`offset`> and <`limit` and `limit to last`> are now guarantee to chain once.

## 0.3.12 27-Oct-2021

- simplify queryCreator code

## 0.3.11 27-Oct-2021

- fix orderBy chain-able but no real effect

## 0.3.10 27-Oct-2021

- preventing user from chain `offset` after `offset`(reduce mistake, however cannot guarantee there is only 1 offset till the end of chain).
- preventing user from chain `limit` or `limit to last` after `limit` or `limit to last`(reduce mistake, however cannot guarantee there is only 1 limit or limit to last till the end of chain).
- fix "Type instantiation is excessively deep and possibly infinite", cause is known but found no explanation for this.
- fix recursive type become `any` after declaration is emitted, that causing the build file query type is not working(becoming un-chain-able, a lot of works done to fix this).

## 0.3.8 26-Oct-2021

- fix `CheckObjectHasDuplicateEndName` not exported bug

## 0.3.0 26-Oct-2021

- now support object type(important upgrade, lot of thing added)
- now all base type members are required, no more partial
- update and set with merge now reject data with stranger member

## 0.1.0 24-Oct-2021

- fix orderBy clause not exist when order with different field name than where clause with "==" or "in" comparator
- fix bug, replace type "=" with "=="

## 0.0.1 15-Oct-2021

-released(beta)

## 0.0.0 15-Oct-2021

- 1st publish
