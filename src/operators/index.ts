import { TypedTest, Erratic } from "../types";

const isNull = <T>(x: Erratic<T>): x is null => x === null;
const isUndefined = <T>(x: Erratic<T>): x is undefined => x === undefined;

const isErratic = <T>(x: Erratic<T>): x is null | undefined =>
  isNull(x) || isUndefined(x);

const and = <T>(...tests: TypedTest<T>[]) => (x: Erratic<T>): x is T =>
  isErratic(x) ? false : tests.every(test => test(x));

const or = <T>(...tests: TypedTest<T>[]) => (x: Erratic<T>): x is T =>
  isErratic(x) ? false : tests.some(test => test(x));

const optional = <T>(test: TypedTest<T>) => (x: Erratic<T>): x is T =>
  isNull(x) ? false : isUndefined(x) ? true : test(x);

const nullable = <T>(test: TypedTest<T>) => (x: Erratic<T>): x is T =>
  isNull(x) ? true : isUndefined(x) ? false : test(x);

const erratic = <T>(test: TypedTest<T>) => (x: Erratic<T>): x is T =>
  isErratic(x) ? true : test(x);

const compose = and;

export { compose, and, or, optional, nullable, erratic };
