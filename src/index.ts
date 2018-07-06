import { ValidatorMap, ObjectTypeGuard, ValueMap, ValueTypeGuard, IterableTypeGuard, ArrayTypeGuard } from "./types";


const Guard = <T>(validators: ValidatorMap<T>): ObjectTypeGuard<T> => (
  values: ValueMap<T>
): values is T => {
  for (const key in validators) {
    const test = validators[key];
    const value = values[key];
    if (!test(value)) return false;
    else continue;
  }
  return true;
};

const GuardEach = <T>(
  test: ValueTypeGuard<T>
): ArrayTypeGuard<T> => (values): values is T[] => {
  for (const value of values) {
    if (!test(value)) return false;
    else continue;
  }
  return true;
};

export { Guard, GuardEach };

export { isNumber, isString, isBoolean, isArray } from "./guards/index";
export { compose, and, or, optional } from "./operators/index";