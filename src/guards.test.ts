import { Guard, GuardEach } from "./index";
import { and } from "./operators/index";
import { isString, isNumber } from "./guards/index";

describe("Guard", () => {
  it("takes an object of keys and validators, validates input with the same keys, and passes if every validator passes (short-ciruit on fail)", () => {
    interface Person {
      name: string;
      age: number;
    }

    const isName = (x: string): x is string => x.length > 1;
    const isAge = (x: number): x is number => 0 <= x && x < 120;

    const isPerson = Guard<Person>({
      name: isName,
      age: isAge
    });

    expect(isPerson({ name: "Kirk", age: 65 })).toBe(true);

    expect(
      isPerson({
        name: "Spock",
        age: 161
      })
    ).toBe(false);

    // @ts-ignore
    expect(isPerson({ name: "tribble" })).toBe(false);
  });

  it("fails gracefully, if passed null or undefined", () => {
    const holmes: User = {
      name: "Sherlock Holmes",
      address: {
        street: "221B Baker St",
        city: "London",
        geo: { lat: "51.520664584", long: "-0.15499938" }
      }
    };

    // @ts-ignore
    const dent: User = {
      name: "Arthur Dent",
      address: null
    };

    const lte = (max: number) => (x: string | number) => +x <= max;
    const gte = (min: number) => (x: string | number) => +x >= min;

    const isNumberAsString = (x: string) =>
      typeof +x === "number" && !isNaN(+x);
    const isValidLat = and(isNumberAsString, gte(-90), lte(90));
    const isValidLong = and(isNumberAsString, gte(-180), lte(180));

    const isValidAddress = Guard<Address>({
      street: isString,
      city: isString,
      geo: Guard({ lat: isValidLat, long: isValidLong })
    });

    const isValidUser = Guard<User>({
      name: isString,
      address: isValidAddress
    });

    interface User {
      name: string;
      address: Address;
    }

    interface Address {
      street: string;
      city: string;
      geo: Geo;
    }

    interface Geo {
      lat: string;
      long: string;
    }

    // @ts-ignore
    expect(isValidUser(null)).toBe(false);
    expect(isValidUser(holmes)).toBe(true);
    expect(isValidUser(dent)).toBe(false);
  });
});

describe("GuardEach", () => {
  it("takes a TypeGuard and an Iterable<T> and passes if each T passes", () => {
    interface CrewMember {
      name: string;
      role: string;
      posting: string;
    }

    const isCrewMember = (x: CrewMember): x is CrewMember =>
      x.posting === "Enterprise";

    const isCrew = GuardEach(isCrewMember);

    const crew1 = [
      { name: "Kirk", role: "captain", posting: "Enterprise" },
      { name: "Spock", role: "commander", posting: "Enterprise" }
    ];

    const crew2 = [
      { name: "Picard", role: "captain", posting: "Enterprise" },
      { name: "Q", role: "foil", posting: "Q-Continuum" }
    ];

    expect(isCrew(crew1)).toBe(true);
    expect(isCrew(crew2)).toBe(false);
  });

  it("returns false if given a value which is not an array", () => {
    const allRight = GuardEach((x: boolean): x is true => x === true);

    // @ts-ignore
    expect(allRight({})).toBe(false);
    // @ts-ignore
    expect(allRight(false)).toBe(false);
    // @ts-ignore
    expect(allRight([false])).toBe(false);
    expect(allRight([])).toBe(true);
    expect(allRight([true])).toBe(true);
  });
});
