import { Inventory, Supply, SupplyAmounts } from "./inventory";
import { Recipe } from "./recipe";

/** The state of the stand: cash, inventory, recipe and selling price. All money is in cents. */
export class LemonadeStand {
  readonly inventory = new Inventory();
  private cashCents: number;
  private priceCents: number;

  constructor(
    readonly recipe: Recipe,
    startingCashCents: number,
    pricePerCupCents: number,
  ) {
    this.cashCents = startingCashCents;
    this.priceCents = pricePerCupCents;
  }

  get cash(): number {
    return this.cashCents;
  }

  get pricePerCup(): number {
    return this.priceCents;
  }

  set pricePerCup(cents: number) {
    if (!Number.isInteger(cents) || cents <= 0) {
      throw new Error(`Invalid price: ${cents}`);
    }
    this.priceCents = cents;
  }

  /** The most units the stand can afford at the given unit price. */
  maxAffordable(unitPriceCents: number): number {
    return Math.floor(this.cashCents / unitPriceCents);
  }

  buy(supply: Supply, quantity: number, unitPriceCents: number): void {
    const cost = quantity * unitPriceCents;
    if (cost > this.cashCents) {
      throw new Error(`Cannot afford ${quantity} ${supply}`);
    }
    this.inventory.add(supply, quantity);
    this.cashCents -= cost;
  }

  /** How many cups could be made from the current inventory. */
  cupsAvailable(): number {
    return this.recipe.maxCups(this.inventory);
  }

  costPerCup(prices: SupplyAmounts): number {
    return this.recipe.costPerCup(prices);
  }

  /**
   * Sells up to `demand` cups, limited by what the inventory can make.
   * Returns the number of cups actually sold.
   */
  sell(demand: number): number {
    const sold = Math.min(demand, this.cupsAvailable());
    this.recipe.consume(this.inventory, sold);
    this.cashCents += sold * this.priceCents;
    return sold;
  }

  /** Leftover ice melts overnight. Returns how much was lost. */
  endDay(): number {
    const melted = this.inventory.count("ice");
    this.inventory.clear("ice");
    return melted;
  }
}
