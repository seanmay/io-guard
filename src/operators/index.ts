import { TypedTest, Flaky } from "../types";

const and = <T>(...tests: TypedTest<T>[]) => (x: Flaky<T>): x is T =>
  x == null ? false : tests.every(test => test(x));

const or = <T>(...tests: TypedTest<T>[]) => (x: Flaky<T>): x is T =>
  x == null ? false : tests.some(test => test(x));

const optional = <T>(test: TypedTest<T>) => (x: Flaky<T>): x is T =>
  x == null ? true : test(x);

const compose = and;

export { compose, and, or, optional };
