import { TypedTest } from "../index"

const compose = <T>(...tests: TypedTest<T>[]) => (x: T): x is T =>
  x != null && tests.every(test => test(x));

const and = <T>(...tests: TypedTest<T>[]) => (x: T): x is T =>
  x != null && tests.every(test => test(x));

const or = <T>(...tests: TypedTest<T>[]) => (x: T): x is T =>
  x != null && tests.some(test => test(x));

const optional = <T>(test: TypedTest<T>) => (x: T): x is T =>
  x == null || test(x);

export { compose, and, or, optional };
