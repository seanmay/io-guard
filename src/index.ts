interface TypeGuard<T> {
  (x: ValueMap<T>): x is T;
}

type ValidatorMap<T> = { [key in keyof T]: TypeGuard<T[key]> };

type ValueMap<T> = { [key in keyof T]: T[key] };

const Guard = <T>(validators: ValidatorMap<T>): TypeGuard<T> => (
  values: ValueMap<T>
): values is T => {
  for (const key in validators) {
    const test = validators[key];
    const value = values[key];
    if (value == null || !test(value)) {
      return false;
    } else { continue; }
  }
  return true;
};

export { Guard };