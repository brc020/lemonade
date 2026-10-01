export const SUPPLIES = ["cups", "ice", "lemons", "sugar"] as const;
export type Supply = (typeof SUPPLIES)[number];

/** An amount of each supply. Used for stock levels, recipes and prices. */
export type SupplyAmounts = Record<Supply, number>;

export class Inventory {
  private stock: SupplyAmounts = { cups: 0, ice: 0, lemons: 0, sugar: 0 };

  count(supply: Supply): number {
    return this.stock[supply];
  }

  add(supply: Supply, quantity: number): void {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error(`Cannot add ${quantity} ${supply}`);
    }
    this.stock[supply] += quantity;
  }

  remove(supply: Supply, quantity: number): void {
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > this.stock[supply]) {
      throw new Error(`Cannot remove ${quantity} ${supply} (have ${this.stock[supply]})`);
    }
    this.stock[supply] -= quantity;
  }

  clear(supply: Supply): void {
    this.stock[supply] = 0;
  }

  snapshot(): SupplyAmounts {
    return { ...this.stock };
  }
}
