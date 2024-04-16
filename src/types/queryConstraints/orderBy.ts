import { OrderByDirection } from '../alias'
import { MetaType, GetAllCompareKeys } from '../metaTypeCreator'
import { __name__ } from '../fieldPath'

export type OrderByConstraint<FieldPath extends string> = {
	type: 'orderBy'
	fieldPath: FieldPath
	directionStr: OrderByDirection
}

export type OrderBy = <
	T extends MetaType,
	FieldPath extends GetAllCompareKeys<T> | __name__
>(
	fieldPath: FieldPath,
	directionStr?: OrderByDirection
) => OrderByConstraint<FieldPath>
