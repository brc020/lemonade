import { Inventory, SUPPLIES, Supply, SupplyAmounts } from "./inventory";

/** How much of each supply goes into one cup of lemonade. */
export class Recipe {
  constructor(private readonly perCup: SupplyAmounts) {}

  amountOf(supply: Supply): number {
    return this.perCup[supply];
  }

  /** How many cups the given inventory can make before something runs out. */
  maxCups(inventory: Inventory): number {
    return Math.min(
      ...SUPPLIES.filter((s) => this.perCup[s] > 0).map((s) =>
        Math.floor(inventory.count(s) / this.perCup[s]),
      ),
    );
  }

  /** Removes the supplies for the given number of cups from the inventory. */
  consume(inventory: Inventory, cups: number): void {
    if (cups > this.maxCups(inventory)) {
      throw new Error(`Not enough supplies to make ${cups} cups`);
    }
    for (const supply of SUPPLIES) {
      inventory.remove(supply, this.perCup[supply] * cups);
    }
  }

  /** Cost in cents of the supplies for one cup at the given unit prices. */
  costPerCup(prices: SupplyAmounts): number {
    return SUPPLIES.reduce((total, s) => total + this.perCup[s] * prices[s], 0);
  }
}
