import { ValidatorMap, ObjectTypeGuard, ValueMap, ValueTypeGuard, IterableTypeGuard, ArrayTypeGuard } from "./types";


const Guard = <T>(validators: ValidatorMap<T>): ObjectTypeGuard<T> => (
  values: ValueMap<T>
): values is T => {
  if (values == null) return false;
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
  if (!Array.isArray(values)) return false;
  for (const value of values) {
    if (!test(value)) return false;
    else continue;
  }
  return true;
};

export { Guard, GuardEach };

export { isNumber, isString, isBoolean, isArray } from "./guards/index";
export { compose, and, or, optional, nullable, erratic } from "./operators/index";
