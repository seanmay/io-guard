import "ts-node";
import { isServerPerson, makePersonFromServerInput } from "./guards";


fetch("./server-person.json")
  .then(res => res.json())
  .then(data => isServerPerson(data)
    ? Promise.resolve(makePersonFromServerInput(data))
    : Promise.reject(data))
  .catch();

