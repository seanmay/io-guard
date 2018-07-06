import { optional, and, or, compose } from "./operators/index";

describe("[Operators] optional", () => {
  it("runs the test function, if given a value", () => {
    const test = optional((x: number) => x === 1);
    expect(test(1)).toBe(true);
    expect(test(2)).toBe(false);
  });

  it("returns true if the passed value is null or undefined", () => {
    const test = optional((x: number) => x === 1);
    expect(test(2)).toBe(false);
    expect(test(null)).toBe(true);
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