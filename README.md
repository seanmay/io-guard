# IO-Guard

A simple object validator which also supports TypeScript type guards, for the purpose of runtime and compile-time validation of foreign data.

### Installation

```bash
yarn add io-guard
```

### Basic Usage

```ts
import { Guard, GuardEach, compose, isString, isNumber } from "io-guard";

interface Person {
  name: string;
  age: number;
}

const isPerson = Guard<Person>({
  name: compose(
    isString,
    name => name.length > 1
  ),
  age: compose(
    isNumber,
    age => age >= 0,
    age => age < 125
  )
});

const arePeople = GuardEach<Person>(isPerson);

const bob = { name: "Bob McKenzie", age: 25 };
const doug = { name: "Doug McKenzie", age: 29 };

if (isPerson(bob)) {
  console.log(
    `The compiler now sees ${bob.name} as a valid Person, in this branch`
  );
}

if (arePeople([bob, doug])) {
  console.log(`The compiler knows that all of these are valid People`);
}
```

The purpose of this library is not to replace an API validator like Joi; those types of schema validations are important for notifying the outside world that something went wrong, and to collect and log/return errors.

The purpose of this library is to ensure that the object that you have been given from somewhere conforms to your (and your compiler) expectations. Examples of places you might consider using it:

- JSON payloads
- DB return data
- localStorage / sessionStorage

And anywhere else where you have some `any` typed object that you want to guarantee can be turned into an object in your system.

```ts
// purchase.service.ts
import { Guard } from "io-guard";
import {
  PurchaseInputInterface,
  makePurchaseFromInput
} from "./purchase.model";

const isValidInput = Guard<PurchaseInputInterface>({
  /* ... */
});

export const getContrivedExample = id =>
  fetch(id).then(
    res =>
      !res.ok
        ? Promise.reject(res)
        : Promise.resolve(res.json()).then(
            data =>
              isValidInput(data)
                ? makePurchaseFromInput(data)
                : Promise.reject(res)));
```

#### Type Guards
This library&rsquo;s type safety is provided by [TypeScript&rsquo;s type guard mechanism](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types). Specifically, through the `<T>(x:any): x is T => {/*...*/}` format [demonstrated in the User-Defined section](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards). Note that the runtime component offers basically the same benefits in JavaScript as in TypeScript; the addition of the type guards is merely for the benefit of having the compiler ensure that you have checked your inputs.

#### Nesting

This should work trivially on nested structures. Should. Though it does no work, whatsoever, to protect against circular references.

```ts
interface Address {
  street: string;
}

interface Person {
  name: { family: string; given: string; };
  address: Address;
  friends: Person[];
}

const isAddress = Guard<Address>({ street: isString });

// nesting is pretty straightforward
const isPerson = Guard<Person>({
  // you can put another one inline
  name: Guard<Person["name"]>({ family: isString, given: isString }),
  // you can attach predefined validators that match the interface
  address: isAddress,
  // you can make recursive calls, if you wrap them in functions with guards
  friends: GuardEach<Person>((x): x is Person => isPerson(x))
});
```

#### Consistency of Payload

It is expected that if you are writing a guard for an object that **all** keys are **always** available. The guard for each member on an object will be run. Any values which return `null` or `undefined` at the time of value lookup will return `false` and fail the test, which will cause the outer guard to fail, and so on, up the tree.

I am sure your API is more than up to the challenge, but in the off chance that you have values that you find yourself saying "If x is defined, and x is not null, is x ___?" (either on load of data, or all the way through your app), then you can opt into telling the guard that the test can still pass, if the field is missing, or null.

They are treated separately because sometimes, in some APIs, `null` values have some special meaning, which is held apart from `undefined`. The point of type guarding input and providing the means to close your system is that as long as you are diligent, you no longer have to test and guess inside of your system, if you know your boundaries are protected. Therefore, opt-in function wrappers have been provided.

```ts
type MessyInput = {
  x: number;
  y: number | null;
  z?: number;
  w?: number | null;
};

const isValidInput = Guard<MessyInput>({
  x: isNumber,
  y: nullable(isNumber), // I can be null
  z: optional(isNumber), // I can be undefined
  w: erratic(isNumber)   // I can be either
});
```
The point is to be honest with the compiler.  
If you want to declare a `Point2D` a `Point3D` and `Vector4D` types, you don&rsquo;t want to have to handle nulls and undefineds everywhere, so instead, if you have valid input (that being input you know how to turn into valid types), do so.

An example might be:

```ts
const flakyInput = { x: 1, y: null };
if (isValidInput(flakyInput)) {
  // I can use this input to make a Point
  return Point(
    flakyInput.x      // this is guaranteed to be a number
    flakyInput.y || 0 // this might be null; my points aren&rsquo;t nullable
  );
}
```


### API

`Guard` and `GuardEach` are the star attractions.  

As a simplification of what is happening, under the hood:

`Guard` takes some `{ [k:string]: (y: T[k]) => y is T[k] }`, and returns `x is T` for the object passed in.  
`GuardEach` takes a `(x:T[]) => x is T[]` and returns `x is T[]` for the array passed in.  

Other composition operators are

- `and<T>(...test[])` -- (does **everything** pass; quick failure)
- `or<T>(...test[])` -- (does **anything** pass; quick success)
- `compose<T>(...test[])` -- (alias for `and`)

Each of the above take regular functions `(x: whatever) => any`, and return `x is T` (so each of these is a valid type guard, itself).

So below are the operators for opting into flaky behaviour:

- `optional<T>(test)` -- (**if** this thing is defined, does it pass)
- `nullable<T>(test)` -- (**if** this thing is not null, does it pass)
- `erratic<T>(test)` -- (**if** this thing is defined **and** is not null, does it pass)

You might compose them like

```ts
const isValidDepartmentInput = Guard<ErraticDepartmentAPIResponse>({
  // sometimes disappears
  departmentIsActive: optional(isBoolean),
  // null if you are a manager
  departmentManagerID: nullable(and(isString, isUUIDFormat)),
  // undefined if it was never set (legacy); null if manually unset
  employeeMoraleImprovementPlan: erratic(isValidImprovementPlan)
});
```

There are also included type guards for basic JS types:

- `isString (x): x is string`
- `isNumber (x): x is number`
- `isBoolean (x): x is boolean`
- `isArray <T>(x: T[]): x is Array<T>`

This API is intended to be very, very small. However, if you need an escape hatch, there are a couple available to you:

- `customTest<T>(test)` -- this operator behaves like the others; it will return false, if you pass it `null` or `undefined`, does the type guard stuff for you, and other than that, lets you run any test you want

- `unsafeTest<T>(test)` -- this operator is an escape that does nothing but provide the `x is T` type guard. If you do something wrong with `null` or `undefined`, it *will* explode spectacularly. You have been warned.

- the ultimate escape hatch: `<T>(x: any): x is T => {}` -- when it comes down to it, this is what all of the guards and operators are, so you can write your own. Just remember that any member on a guard must return `x is T`, instead of `boolean` or `any`, otherwise the compiler is going to be very unhappy with you. This is not a problem for JS, of course. And once again, the library is not going to do anything to protect your raw type guard from mishandling the value passed. Caveat tester.