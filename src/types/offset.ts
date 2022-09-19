import { OffsetConstraint } from './queryConstraints'
import { ErrorLimitInvalidNumber } from './error'

export type Offset = <Value extends number>(
	offset: Value extends 0
		? ErrorLimitInvalidNumber
		: number extends Value
		? Value
		: Value extends infer R
		? `${R & number}` extends `-${number}` | `${number}.${number}`
			? ErrorLimitInvalidNumber
			: Value
		: never // impossible route
) => OffsetConstraint
