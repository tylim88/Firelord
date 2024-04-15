export const handleEmptyArray = <T>(
	arr: unknown[],
	isEmpty: T,
	isFilled: () => T
) => {
	return arr.length === 0 ? isEmpty : isFilled()
}

export const buildPathFromColIDsAndDocIDs = ({
	collectionIDs,
	documentIDs,
}: {
	collectionIDs: string[]
	documentIDs: string[]
}) => {
	return collectionIDs
		.reduce((acc, collectionId, index) => {
			const documentID = documentIDs[index] ? `${documentIDs[index]}/` : ''
			return `${acc}${collectionId}/${documentID}`
		}, '')
		.slice(0, -1)
}
