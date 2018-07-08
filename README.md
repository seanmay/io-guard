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

### API

Coming Soon

`Guard` and `GuardEach` are the star attractions.  

As a simplification of what is happening, under the hood:

`Guard` takes some `{ [k:string]: (y: T[k]) => y is T[k] }`, and returns `x is T` for the object passed in.  
`GuardEach` takes a `(x:T[]) => x is T[]` and returns `x is T[]` for the array passed in.  

Other composition operators are

- `and<T>(...test[])` -- (does **everything** pass; quick failure)
- `or<T>(...test[])` -- (does **anything** pass; quick success)
- `compose<T>(...test[])` -- (alias for `and`)

Each of the above take regular functions `(x: whatever) => any`, and return `x is T` (so each of these is a valid typeguard, itself).

All of the above *require the value to exist and to be non-null*! If they receive `undefined` or `null`, they will immediately fail, without ever running their tests.  
That prevents you from running tests that end in crashing your JS with `can't access property ___ of null`. That&rsquo;s a good thing. But databases and SOAP APIs and `localStorage` are not so kind.

So below are the operators for opting into flaky behaviour:

- `optional<T>(test)` -- (**if** this thing is defined, does it pass)
- `nullable<T>(test)` -- (**if** this thing is not null, does it pass)
- `erratic<T>(test)` -- (**if** this thing is defined **and** is not null, does it pass)

You might use them like

```ts
const isValidDepartmentInput = Guard<ErraticDepartmentAPIResponse>({
  // sometimes disappears
  departmentIsActive: optional(isBoolean),
  // null if you are a manager
  departmentManagerID: nullable(and(isString, isUUIDFormat)),
  // undefined if it was never set (legacy department); null if it was unset
  employeeMoraleImprovementPlan: erratic(isValidImprovementPlan)
});
```

There are also included typeguards for basic JS types:

- `isString (x): x is string`
- `isNumber (x): x is number`
- `isBoolean (x): x is boolean`
- `isArray <T>(x: T[]): x is Array<T>`
