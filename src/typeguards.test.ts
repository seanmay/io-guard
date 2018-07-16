import {
  isTypeof,
  isArray
} from "./guards/guards";

describe("[Guards] isTypeof", () => {
  it("Provides a TypeGuard for a type, given input value, based on `typeof` checks", () => {
    const isNumber = isTypeof(1);
    const isString = isTypeof("");

    const stringInput = "3";
    const numberInput = 3;

    // @ts-ignore
    expect(isNumber(stringInput)).toBe(false);
    expect(isNumber(numberInput)).toBe(true);

    expect(isString(stringInput)).toBe(true);
    // @ts-ignore
    expect(isString(numberInput)).toBe(false);
  });
});

describe("[Guards] isArray", () => {
  it("Provides a TypeGuard for `T[]`", () => {
    const x = 3;
    const xs = [x];

    // @ts-ignore
    expect(isArray(3)).toBe(false);
    expect(isArray(xs)).toBe(true);
  });
});
