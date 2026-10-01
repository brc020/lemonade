import { SUPPLIES, SupplyAmounts } from "./inventory";

/** Typical unit price of each supply, in cents. */
const BASE_PRICES: SupplyAmounts = { cups: 5, ice: 2, lemons: 25, sugar: 10 };

/** How far a day's price can drift from the base price, as a fraction. */
const VARIATION = 0.3;

/** Supplies the day's supply prices, which fluctuate around the base prices. */
export class Market {
  todaysPrices(): SupplyAmounts {
    const prices = { ...BASE_PRICES };
    for (const supply of SUPPLIES) {
      const factor = 1 + (Math.random() * 2 - 1) * VARIATION;
      prices[supply] = Math.max(1, Math.round(BASE_PRICES[supply] * factor));
    }
    return prices;
  }
}
