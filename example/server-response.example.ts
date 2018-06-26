import "ts-node";

import { Guard } from "../src/index";
import { isString, isNumber } from "../src/guards/index";
import { and, optional } from "../src/operators/index";

interface ServerResponsePerson {
  person_first_name: string;
  person_last_name: string;
  person_age: number;
  person_weight: number;
}

interface Person {
  name: { given: string; family: string };
  age: number;
}

const isServerPerson = Guard<ServerResponsePerson>({
  person_first_name: isString,
  person_last_name: and(isString, name => name.length > 0),
  person_age: and(isNumber, x => x >= 0, x => x <= 120),
  person_weight: optional(and(isNumber, x => x))
});

const makePersonFromServerInput = ({
  person_first_name,
  person_last_name,
  person_age
}: ServerResponsePerson): Person => ({
  name: { given: person_first_name, family: person_last_name },
  age: person_age
});

export { isServerPerson, makePersonFromServerInput };
