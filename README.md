<!-- markdownlint-disable MD010 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD041 -->

<div align="center">
		<img src="https://raw.githubusercontent.com/tylim88/Firelord/main/img/ozai.png" width="200px"/>
		<h1>Firelord 烈火君</h1>
</div>

<div align="center">
		<a href="https://www.npmjs.com/package/firelord" target="_blank">
				<img
					src="https://img.shields.io/npm/v/firelord"
					alt="Created by tylim88"
				/>
			</a>
			&nbsp;
			<a
				href="https://github.com/tylim88/firelord/blob/main/LICENSE"
				target="_blank"
			>
				<img
					src="https://img.shields.io/github/license/tylim88/firelord"
					alt="License"
				/>
			</a>
			&nbsp;
			<a
				href="https://www.npmjs.com/package/firelord?activeTab=dependencies"
				target="_blank"
			>
				<img
					src="https://img.shields.io/badge/dynamic/json?url=https://api.npmutil.com/package/firelord&label=dependencies&query=$.dependencies.count&color=brightgreen"
					alt="dependency count"
				/>
			</a>
			&nbsp;
			<img
				src="https://img.shields.io/badge/gzipped-6KB-brightgreen"
				alt="package size"
			/>
			&nbsp;
			<a href="https://github.com/tylim88/Firelord/actions" target="_blank">
				<img
					src="https://github.com/tylim88/Firelord/workflows/Main/badge.svg"
					alt="github action"
				/>
			</a>
			&nbsp;
			<a href="https://codecov.io/gh/tylim88/Firelord" target="_blank">
				<img
					src="https://codecov.io/gh/tylim88/Firelord/branch/main/graph/badge.svg"
					alt="code coverage"
				/>
			</a>
			&nbsp;
			<a href="https://github.com/tylim88/Firelord/issues" target="_blank">
				<img
					alt="GitHub issues"
					src="https://img.shields.io/github/issues-raw/tylim88/firelord"
				></img>
			</a>
			&nbsp;
			<a href="https://snyk.io/test/github/tylim88/FirelordJS" target="_blank">
				<img
					src="https://snyk.io/test/github/tylim88/FirelordJS/badge.svg"
					alt="code coverage"
				/>
			</a>
			&nbsp;
			<a
				href="https://lgtm.com/projects/g/tylim88/Firelord/alerts/"
				target="_blank"
			>
				<img
					alt="Total alerts"
					src="https://img.shields.io/lgtm/alerts/g/tylim88/Firelord.svg?logo=lgtm&logoWidth=18"
				/>
			</a>
			&nbsp;
			<a
				href="https://lgtm.com/projects/g/tylim88/Firelord/context:javascript"
				target="_blank"
			>
				<img
					alt="Language grade: JavaScript"
					src="https://img.shields.io/lgtm/grade/javascript/g/tylim88/Firelord.svg?logo=lgtm&logoWidth=18"
				/>
			</a>
</div>
<br/>
<div align="center">
		<i>Extremely High Precision Typescript Wrapper for Firestore Admin, Providing Unparalleled Type Safe and Dev Experience</i>
</div>
<br/>
<div align="center">
		<i>Modular, Minuscule, Intuitive, Unopinionated, Craftsmanship, Ultimate, Peaceful, Deep</i>
</div>
<br/>
<div align="center">
	<i>Of The VFQAT &#160;&#160;||&#160;&#160; By The VFQAT &#160;&#160;||&#160;&#160; For The VFQAT</i>
</div>
<br />
<div align="center">
	<i>End Firestore Typing Madness</i>
</div>
<br />
<div align="center">
<a href="https://firelordjs.com/firelord/quick_start" target="_blank" style="color:blue"><strong>Documentation</strong></a>
</div>
<br/>

## Note

This library updated from v0 to v1, v0 is not compatible with v1.

This change is necessary as v1 corrected a lot of issues in v0.

The v0 documentation can still be found [here](https://github.com/tylim88/Firelord/tree/96739759a5d848c77259b53fb3850f2950dd72cb).

## Why Do You Need This? What Problem Firelord Solves?

Read here at [FirelordJS](https://github.com/tylim88/FirelordJS#readme).

## About

This wrapper wrap around admin Firestore V8 interface(There is no V9 for admin version) and turn it into V9 interface.

The API is basically same as the web version, both web and admin version basically share the same documentation.

It does not become modular like the web version, but this is ok because we don't care about package size in back end.

The ultimate goal is to unify the knowledge of back end and front end, so we don't need to learn both V9 and V8 and most importantly: absolute type safe.

It is not possible to unified platform specific API, good thing is most of these APIs are mutually exclusive.

## Why Not Merge Firelord and FirelordJS?

The idea behind merging is code reuse and reduce maintenance, but there are technical reasons that make merging a terrible idea.

1. V8 and V9 do not share the same behavior. One example is V9 `arrayUnion` and `arrayRemove` able to accept empty array argument, but this is not possible in V8 and will result in runtime exception. To solve this we need extra code for V8 wrapper and the logic become dead code in environment that use V9 wrapper. This is not a big deal, it adds negligible amount of code, but it tells us is, we cannot assume V8 and V9 are the same.

2. Mutually exclusive APIs. For example admin is more powerful and has APIs like `create`, `getAll` and `listCollections`; while web has cache related APIs like `getDocFromCache`, `getDocFromServer` and `enableIndexedDbPersistence`. It is not possible to export everything.

3. Mutually inclusive API with platform dependent parameter. For example, admin's `delete` and `update` has extra parameter: `precondition` while web's `onSnapshots` has `snapshotListerOptions` parameter and `documentSnapshot.data` has `snapshotOptions` parameter. Even though we can ignore those parameters under the hood if it runs in the irrelevant environment, developer would still able to see it via type hint or JSDoc, which can be confusing.

4. FirelordJS wraps V9 into type safe V9 and Firelord wraps V8 into type safe V9. So the wrapping logics are different, which mean merging will add significant amount of code.

5. Both libraries import original types from original SDKs to keep internal type safe. If we merge both library, then we would have 2 set of original types.

So that is why merging could do more harm than good in this case, especially point 2 and 3 which are detrimental to developer experience. Firelord is not simply a copy and paste of FirelordJS, there are a lot of details need to be taken care of.

One of the core principal of the libraries is to preserve originality, if we went for absolute unified interface, then we need to give up a lot.

TLDR: they look the same, but they are not the same.

## Related Projects

1. [FirelordJS](https://github.com/tylim88/FirelordJS) - Typescript wrapper for Firestore Web
2. [Firelordrn](https://github.com/tylim88/firelordrn) - Typescript wrapper for Firestore React Native
3. [FireLaw](https://github.com/tylim88/firelaw) - Write Firestore security rule with Typescript, utilizing Firelord type engine.
4. [FireCall](https://github.com/tylim88/FireCall) - Helper Function to write easier and safer Firebase onCall function.
