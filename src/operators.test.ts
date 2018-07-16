import {
  optional,
  nullable,
  erratic,
  and,
  or,
  compose,
  customTest,
  unsafeTest
} from "./operators/operators";

describe("[Operators] optional", () => {
  it("runs the test function, if given a value", () => {
    const test = optional((x: number) => x === 1);
    expect(test(1)).toBe(true);
    expect(test(2)).toBe(false);
  });

  it("returns true if the passed value is undefined, and false if the value is null", () => {
    const test = optional((x: number) => x === 1);
    expect(test(2)).toBe(false);
    expect(test(null)).toBe(false);
    expect(test(undefined)).toBe(true);
  });
});

describe("[Operators] nullable", () => {
  it("runs the test function, if given a value", () => {
    const test = nullable((x: number) => x === 1);
    expect(test(1)).toBe(true);
    expect(test(2)).toBe(false);
  });

  it("returns true if the passed value is null, and false if the value is undefined", () => {
    const test = nullable((x: number) => x === 1);
    expect(test(2)).toBe(false);
    expect(test(null)).toBe(true);
    expect(test(undefined)).toBe(false);
  });
});

describe("[Operators] erratic", () => {
  it("runs the test function, if given a value", () => {
    const test = erratic((x: number) => x === 1);
    expect(test(1)).toBe(true);
    expect(test(2)).toBe(false);
  });

  it("returns true if the passed value is null or undefined", () => {
    const test = erratic((x: number) => x === 1);
    expect(test(2)).toBe(false);
    expect(test(null)).toBe(true);
    expect(test(undefined)).toBe(true);
  });
});

describe("[Operators] and", () => {
  it("runs a series of tests on the same value, and passes only if the value exists, and every test passes (short-circuit on fail)", () => {
    const test1 = (x: number) => x > 5;
    const test2 = (x: number) => x < 10;
    const test3 = (x: number) => !(x % 3);

    const suite1 = and(test1, test2, test3);
    const suite2 = and(test1, test2);

    const input1 = 3;
    const input2 = 6;
    const input3 = 7;
    const input4 = 20;
    const input5 = null;

    expect(suite1(input1)).toBe(false);
    expect(suite1(input2)).toBe(true);
    expect(suite1(input3)).toBe(false);
    expect(suite1(input4)).toBe(false);
    expect(suite1(input5)).toBe(false);

    expect(suite2(input1)).toBe(false);
    expect(suite2(input2)).toBe(true);
    expect(suite2(input3)).toBe(true);
    expect(suite2(input4)).toBe(false);
    expect(suite2(input5)).toBe(false);
  });
});

describe("[Operators] or", () => {
  it("runs a series of tests on the same value, and passes if the value exists, and any of the tests pass (short-circuit on success)", () => {
    const test1 = (x: number) => 5 < x && x < 10;
    const test2 = (x: number) => !(x % 3);

    const suite1 = or(test1, test2);

    const input1 = 3;
    const input2 = 6;
    const input3 = 7;
    const input4 = 20;
    const input5 = null;

    expect(suite1(input1)).toBe(true);
    expect(suite1(input2)).toBe(true);
    expect(suite1(input3)).toBe(true);
    expect(suite1(input4)).toBe(false);
    expect(suite1(input5)).toBe(false);
  });
});

describe("[Operators] compose", () => {
  it("is an alias for `Operators.and`", () => {
    expect(compose).toBe(and);
  });
});

describe("[Operators] customTest", () => {
  it("will return truthy if the test returns a truthy value", () => {
    expect(customTest(x => typeof x === "number")(5)).toBe(true);
  });

  it("will not throw on null or undefined", () => {
    //@ts-ignore
    const hasLength = customTest(x => !!x.length);
    expect(hasLength("1")).toBe(true);
    expect(hasLength(null)).toBe(false);
  });
});

describe("[Operators] unsafeTest", () => {
  it("will return truthy if the test returns a truthy value", () => {
    const isNumber = unsafeTest(x => typeof x === "number");
    expect(isNumber(5)).toBe(true);
  });

  it("will throw if null or undefined are unhandled", () => {
    //@ts-ignore
    const hasLength = unsafeTest(x => x.length);
    expect(() => hasLength(null)).toThrow();
  });
});
