import { ValueTypeGuard } from "../types";

const isTypeof = <T>(type: T): ValueTypeGuard<T> => (x: T): x is T => typeof x === typeof type;

const isString = isTypeof(String());
const isNumber = isTypeof(Number());
const isBoolean = isTypeof(Boolean());

const isArray = <T>(xs: T[]): xs is T[] => Array.isArray(xs);

export { isString, isNumber, isBoolean, isArray, isTypeof };