export interface ObjectTypeGuard<T> {
  (x: any): x is T;
}

export interface ArrayTypeGuard<T> {
  (xs: any[]): xs is T[];
}

export interface ValueTypeGuard<T> {
  (x: T): x is T;
}

export interface TypedTest<T> {
  (x: T): any;
}

export type ValidatorMap<T> = { [key in keyof T]: ValueTypeGuard<T[key]> };
export type ValueMap<T> = { [key in keyof T]: T[key] };

export type Erratic<T> = T | null | undefined;
export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;