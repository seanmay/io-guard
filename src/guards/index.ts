const isTypeof = <T>(type: T) => (x: T): x is T => typeof x === typeof type;

const isNumber = isTypeof(Number());
const isString = isTypeof(String());
const isBoolean = isTypeof(Boolean());

const isArray = (x: any[]): x is any[] => Array.isArray(x);
const isFunction = (x: Function): x is Function => x instanceof Function;

export { isTypeof, isNumber, isString, isBoolean, isArray, isFunction };
