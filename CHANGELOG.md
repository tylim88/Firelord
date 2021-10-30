# HISTORY

Change log

## 0.7.3 29-Oct-2021

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
