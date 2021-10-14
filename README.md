# firelord

the completely typed admin firestore and firebase callable function wrapper you need

firestore

- generate different read(get operation) and write type(set/update operation) for FieldValue
- FieldValue server timestamp `{write:FieldValue, read:{nanoseconds:number, seconds: number}}`
- FieldValue eg number `{write:FieldValue | number, read:number}`
- FieldValue eg numberArray `{write: numberArray | FieldValue, numberArray}`
- partially type collection path and document path reduce mistake (it is impossible to completely not reliable on string type in document and collection path name)
- fully typed group collection query path
- auto add createdAt and updatedAt server timestamp to document (set operation add both updated and created, update operation update updatedAt)

callable function (even though this is highly opinionated, I believe the flow is practical in most use case)

- easily check and type request data and respond data with npm zod library(firelord provide first class support for zod)
- handle error(and logging with firebase logging) internally, handler just need to return `{error: firebase https error code, message?:string, details?:unknown }` to function
- specifically handle unauthenticated and invalid argument errors internally.
- for private route, context.auth object are guarantee to be not undefined (type is handled internally) when passed to handler.
- return `{resData: object}` to function to reply request

To generate the wrapper, you just need to prepare the type(callable function require zod) and generate the type with this library wrapper creator function and you can enjoy all the utility mentioned.

The library is not yet ready(but highly completed) and I plan to release it in November

<!--
[![npm](https://img.shields.io/npm/v/firelord)](https://www.npmjs.com/package/firelord) [![GitHub](https://img.shields.io/github/license/tylim88/firelord)](https://github.com/tylim88/firelord/blob/master/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/tylim88/firelord/pulls) [![tylim88](https://circleci.com/gh/tylim88/firelord.svg?style=shield)](<[LINK](https://github.com/tylim88/firelord#firelord)>)

🐤 The completely typed firebase admin firestore and function wrapper you need.

🥰 0 dependency.

⛲️ Out of box typescript support.

🦺 Tested.

## Installation

```bash
npm i firelord
```

## Usage

🎵 Usage

````ts

``` -->

```

```

```

```

```

```
