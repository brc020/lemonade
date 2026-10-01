import type { Supplies } from "./lemonadeStand";

//HOW THE MARKET AND buySupplies WORK TOGETHER
//
//Market and LemonadeStand are two separate classes with separate jobs:
//  - Market knows what supplies cost today. It knows nothing about the stand.
//  - LemonadeStand knows its own money and supplies. It does not know how
//    prices are decided.
//
//They meet in LemonadeStand.buySupplies(market, order). The market object is
//passed in as a parameter, and buySupplies calls market.getPrices() to find
//out what to charge. The stand then does the rest itself: adds up the cost,
//checks it can afford it, takes the money out and adds the supplies.
//
//  const market = new Market();
//  const stand = new LemonadeStand();
//  market.newDay();                                     //set today's prices
//  stand.buySupplies(market, { cups: 10, ice: 30, lemons: 10, sugar: 10 });
//
//lemonadeStand.ts never imports this file. Instead it declares an interface
//that only says "a market is anything with a getPrices() method that returns
//Supplies". TypeScript checks types by shape, not by name, so this class is
//accepted by buySupplies just because it has a matching getPrices() method.
//That means the stand only depends on that one method, and the way prices
//are picked in here can change without touching lemonadeStand.ts.

//normal price of each supply in dollars
const BASE_PRICES: Supplies = { cups: 0.05, ice: 0.02, lemons: 0.25, sugar: 0.1 };

//how far a price can move from its normal price (0.3 = up or down 30%)
const VARIATION = 0.3;

export class Market {
  prices: Supplies;


  constructor() {
    this.prices = { ...BASE_PRICES };
    this.newDay();
  }


  //pick new random prices, call this once at the start of each day
  newDay(): void {
    this.prices = {
      cups: this.randomPrice(BASE_PRICES.cups),
      ice: this.randomPrice(BASE_PRICES.ice),
      lemons: this.randomPrice(BASE_PRICES.lemons),
      sugar: this.randomPrice(BASE_PRICES.sugar),
    };
  }


  //today's prices, these stay the same until newDay is called again
  //so the price shown to the player is the price buySupplies charges
  getPrices(): Supplies {
    return { ...this.prices };
  }


  //a price near the base price, rounded to cents and never below 1 cent
  private randomPrice(base: number): number {
    const change = 1 + (Math.random() * 2 - 1) * VARIATION;
    return Math.max(0.01, Math.round(base * change * 100) / 100);
  }
}
