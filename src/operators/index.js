"use strict";
exports.__esModule = true;
var and = function () {
    var tests = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tests[_i] = arguments[_i];
    }
    return function (x) {
        return x == null ? false : tests.every(function (test) { return test(x); });
    };
};
exports.and = and;
var or = function () {
    var tests = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tests[_i] = arguments[_i];
    }
    return function (x) {
        return x == null ? false : tests.some(function (test) { return test(x); });
    };
};
exports.or = or;
var optional = function (test) { return function (x) {
    return x == null ? true : test(x);
}; };
exports.optional = optional;
var compose = and;
exports.compose = compose;
