import { OrderByDirection } from '../alias'
import { MetaType, GetAllCompareKeys } from '../metaTypeCreator'

export type OrderByConstraint<
	T extends MetaType,
	FieldPath extends GetAllCompareKeys<T>,
	DirectionStr extends OrderByDirection | undefined = undefined
> = {
	type: 'orderBy'
	fieldPath: FieldPath
	directionStr: DirectionStr
}

export type OrderBy = <
	T extends MetaType,
	FieldPath extends GetAllCompareKeys<T>,
	DirectionStr extends OrderByDirection | undefined = undefined
>(
	fieldPath: FieldPath,
	directionStr?: DirectionStr
) => OrderByConstraint<T, FieldPath, DirectionStr>
