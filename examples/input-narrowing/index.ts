import { Guard, test } from "../../src/index";

type Coin = Nickel | Dime | Quarter;

const withinPrecision = <n extends number>(precision: number, target: n) => (value: n) => {
  const floor = target - precision;
  const ceiling = target + precision;
  return floor <= value && value < ceiling;
};

const isQuarter = Guard<Quarter>({
  weight: test(withinPrecision<Quarter["weight"]>(0.1, 5.67)),
  diameter: test(x => x === 24.26),
  thickness: test(x => x === 1.75)
});

const filterQuarter = (coin: Coin): Promise<Quarter> =>
  isQuarter(coin)
    ? Promise.resolve(coin as Quarter)
    : Promise.reject(coin); // Dime | Nickel | counterfeit | broken

const onCoinInput = (coin: Coin) =>
  filterQuarter(coin)
    .then(provideGoods, returnCoin)
    .catch(handleDeliveryError);

const provideGoods = (quarter: Quarter) => {/*...*/};
const returnCoin = (coin: Exclude<Coin, Quarter>) => {/*...*/};
const handleDeliveryError = (err: any) => {/*...*/};

interface Nickel {
  weight: 5;
  diameter: 21.21;
  thickness: 1.95;
}

interface Dime {
  weight: 2.268;
  diameter: 17.91;
  thickness: 1.35;
}

interface Quarter {
  weight: 5.670;
  diameter: 24.26;
  thickness: 1.75;
}
