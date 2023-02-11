import { LimitConstraint } from './queryConstraints'
import { ErrorLimitInvalidNumber } from './error'
import { Narrow } from './utils'

export type LimitCreator = <Type extends 'limit' | 'limitToLast'>(
	type: Type
) => <Value extends number>(
	limit: Narrow<Value> extends 0
		? ErrorLimitInvalidNumber
		: number extends Value
		? Value
		: Value extends infer R
		? `${R & number}` extends `-${number}` | `${number}.${number}`
			? ErrorLimitInvalidNumber
			: Value
		: never // impossible route
) => LimitConstraint<Type, Value>
