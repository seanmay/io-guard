import { Guard, GuardEach } from "./index";

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
      { name: "Q", role: "foil", posting: "Q-continuum" }
    ];

    expect(isCrew(crew1)).toBe(true);
    expect(isCrew(crew2)).toBe(false);
  });
});