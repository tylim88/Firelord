export const handleEmptyArray = <T>(
	arr: unknown[],
	isEmpty: T,
	isFilled: () => T
) => {
	return arr.length === 0 ? isEmpty : isFilled()
}
