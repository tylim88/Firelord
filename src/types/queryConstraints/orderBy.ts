import { OrderByDirection } from '../alias'
import { MetaType } from '../metaTypeCreator'

export type OrderByConstraint<
	FieldPath extends string,
	DirectionStr extends OrderByDirection | undefined = undefined
> = {
	type: 'orderBy'
	fieldPath: FieldPath
	directionStr: DirectionStr
}

export type OrderBy = <
	T extends MetaType,
	FieldPath extends keyof T['compare'] & string,
	DirectionStr extends OrderByDirection | undefined = undefined
>(
	fieldPath: FieldPath,
	directionStr?: DirectionStr
) => OrderByConstraint<FieldPath, DirectionStr>
