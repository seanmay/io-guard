import { TypedTest, Erratic } from "../types";

const and = <T>(...tests: TypedTest<T>[]) => (x: Erratic<T>): x is T =>
  x == null ? false : tests.every(test => test(x));

const or = <T>(...tests: TypedTest<T>[]) => (x: Erratic<T>): x is T =>
  x == null ? false : tests.some(test => test(x));

const optional = <T>(test: TypedTest<T>) => (x: Erratic<T>): x is T =>
  x === null ? false : x === undefined ? true : test(x);

const nullable = <T>(test: TypedTest<T>) => (x: Erratic<T>): x is T =>
  x === null ? true : x === undefined ? false : test(x);

const erratic = <T>(test: TypedTest<T>) => (x: Erratic<T>): x is T =>
  x === null || x === undefined ? true : test(x);

const compose = and;

export { compose, and, or, optional, nullable, erratic };
