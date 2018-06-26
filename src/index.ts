export interface TypeGuard<T> {
  (x: ValueMap<T>): x is T;
}

export interface TypedTest<T> {
  (x: T): any;
}

export type ValidatorMap<T> = { [key in keyof T]: TypeGuard<T[key]> };

export type ValueMap<T> = { [key in keyof T]: T[key] };

const Guard = <T>(validators: ValidatorMap<T>): TypeGuard<T> => (
  values: ValueMap<T>
): values is T => {
  for (const key in validators) {
    const test = validators[key];
    const value = values[key];
    if (value == null || !test(value)) return false;
    else continue;
  }
  return true;
};

export { Guard };

export {
  isNumber,
  isString,
  isBoolean,
  isFunction,
  isArray
} from "./guards/index";
export { compose, and, or, optional } from "./operators/index";
