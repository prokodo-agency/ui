/**
 * Checks if a given value is a non-null, non-undefined, non-empty string.
 */
export const isString = (e?: string | null): boolean =>
  typeof e === "string" && e.trim() !== ""

/**
 * Checks if a given string is equal to another string.
 */
export const isEqual = (a?: string, b?: string): boolean => a === b

/**
 * Checks if a given value is a non-null, non-undefined, non-empty number.
 */
export const isNumber = (e?: number | null): boolean => typeof e === "number"

/**
 * Checks if a given value is a valid array with at least one element.
 */
export const isArray = <T>(array: T[] | null | undefined): array is T[] =>
  Array.isArray(array) && array.length > 0

/**
 * Checks if a given value is not null or undefined.
 */
export const isNull = (e: unknown): boolean => e === null || e === undefined

/**
 * Checks if a given value is true.
 */
export const isTrue = (e?: boolean): boolean => e !== false && e !== undefined
