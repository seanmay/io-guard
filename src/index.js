"use strict";
exports.__esModule = true;
var Guard = function (validators) { return function (values) {
    for (var key in validators) {
        var test_1 = validators[key];
        var value = values[key];
        if (!test_1(value))
            return false;
        else
            continue;
    }
    return true;
}; };
exports.Guard = Guard;
var GuardEach = function (test) { return function (values) {
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var value = values_1[_i];
        if (!test(value))
            return false;
        else
            continue;
    }
    return true;
}; };
exports.GuardEach = GuardEach;
var index_1 = require("./guards/index");
exports.isNumber = index_1.isNumber;
exports.isString = index_1.isString;
exports.isBoolean = index_1.isBoolean;
exports.isArray = index_1.isArray;
var index_2 = require("./operators/index");
exports.compose = index_2.compose;
exports.and = index_2.and;
exports.or = index_2.or;
exports.optional = index_2.optional;
