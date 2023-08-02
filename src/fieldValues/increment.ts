import { FieldValue } from 'firebase-admin/firestore'
import { Increment } from '../types'

/**
 * Returns a special value that can be used with set(), create() or update()
 * that tells the server to increment the field's current value by the given
 * value.
 *
 * If either current field value or the operand uses floating point
 * precision, both values will be interpreted as floating point numbers and
 * all arithmetic will follow IEEE 754 semantics. Otherwise, integer
 * precision is kept and the result is capped between -2^63 and 2^63-1.
 *
 * If the current field value is not of type 'number', or if the field does
 * not yet exist, the transformation will set the field to the given value.
 *
 * @param n The value to increment by.
 * @return The FieldValue sentinel for use in a call to set(), create() or
 * update().
 */
// @ts-expect-error
export const increment = (n: number): Increment => FieldValue.increment(n)
