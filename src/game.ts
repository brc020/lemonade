import * as readline from "node:readline";
import { SUPPLIES, SupplyAmounts } from "./inventory";
import { LemonadeStand } from "./lemonadeStand";
import { Market } from "./market";
import { Recipe } from "./recipe";
import { Weather } from "./weather";

const DAYS = 15;
const STARTING_CASH = 2000;
const STARTING_PRICE = 100;

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Thrown when keyboard input ends before the game does. */
class InputClosed extends Error {}

/** Runs the day-by-day game loop and handles all text input and output. */
export class Game {
  private readonly stand = new LemonadeStand(
    new Recipe({ cups: 1, ice: 3, lemons: 1, sugar: 1 }),
    STARTING_CASH,
    STARTING_PRICE,
  );
  private readonly market = new Market();
  private readonly rl = readline.createInterface({ input: process.stdin });
  private readonly lines = this.rl[Symbol.asyncIterator]();

  async run(): Promise<void> {
    console.log("=== Lemonade Stand ===");
    console.log(`You have ${DAYS} days and ${money(this.stand.cash)} to start with.`);
    console.log(`Each cup of lemonade uses: ${this.describeRecipe()}.`);
    console.log("Leftover ice melts at the end of each day.");

    try {
      for (let day = 1; day <= DAYS; day++) {
        await this.playDay(day);
      }
      console.log("\n=== Game over ===");
      console.log(`Final cash balance: ${money(this.stand.cash)}`);
      console.log(`Profit: ${money(this.stand.cash - STARTING_CASH)}`);
    } catch (error) {
      if (!(error instanceof InputClosed)) throw error;
      console.log("\nInput closed. Game ended early.");
    } finally {
      this.rl.close();
    }
  }

  private async playDay(day: number): Promise<void> {
    const weather = Weather.random();
    const prices = this.market.todaysPrices();

    console.log(`\n--- Day ${day} of ${DAYS} ---`);
    console.log(`Weather: ${weather.describe()}`);
    console.log(`Cash: ${money(this.stand.cash)}`);
    console.log(`Inventory: ${this.describeInventory()}`);
    console.log("Today's supply prices:");
    for (const supply of SUPPLIES) {
      console.log(`  ${supply.padEnd(7)} ${money(prices[supply])} each`);
    }
    console.log(`Cost to make one cup today: ${money(this.stand.costPerCup(prices))}`);

    await this.buySupplies(prices);
    await this.setPrice();

    const canMake = this.stand.cupsAvailable();
    const sold = this.stand.sell(weather.demand(this.stand.pricePerCup));
    const melted = this.stand.endDay();

    console.log(`\nDay ${day} results:`);
    console.log(`  Cups sold: ${sold} at ${money(this.stand.pricePerCup)} each`);
    if (sold === canMake && canMake > 0) {
      console.log("  You sold out!");
    }
    if (melted > 0) {
      console.log(`  ${melted} ice melted overnight.`);
    }
    console.log(`  Supplies left: ${this.describeInventory()}`);
    console.log(`  Cash balance: ${money(this.stand.cash)}`);
  }

  private async buySupplies(prices: SupplyAmounts): Promise<void> {
    console.log("");
    for (const supply of SUPPLIES) {
      const max = this.stand.maxAffordable(prices[supply]);
      const quantity = await this.askWholeNumber(
        `How many ${supply} to buy? (0-${max}) `,
        max,
      );
      this.stand.buy(supply, quantity, prices[supply]);
    }
    console.log(
      `You can make ${this.stand.cupsAvailable()} cups. Cash left: ${money(this.stand.cash)}`,
    );
  }

  private async setPrice(): Promise<void> {
    for (;;) {
      const answer = await this.ask(
        `Price per cup in dollars? (Enter to keep ${money(this.stand.pricePerCup)}) `,
      );
      if (answer === "") return;
      const cents = Math.round(Number(answer.replace(/^\$/, "")) * 100);
      if (Number.isInteger(cents) && cents > 0) {
        this.stand.pricePerCup = cents;
        return;
      }
      console.log("Please enter a price greater than zero, like 1.25.");
    }
  }

  private async askWholeNumber(prompt: string, max: number): Promise<number> {
    for (;;) {
      const answer = await this.ask(prompt);
      if (/^\d+$/.test(answer) && Number(answer) <= max) {
        return Number(answer);
      }
      console.log(`Please enter a whole number from 0 to ${max}.`);
    }
  }

  private async ask(prompt: string): Promise<string> {
    process.stdout.write(prompt);
    const line = await this.lines.next();
    if (line.done) throw new InputClosed();
    return line.value.trim();
  }

  private describeInventory(): string {
    const stock = this.stand.inventory.snapshot();
    return SUPPLIES.map((s) => `${stock[s]} ${s}`).join(", ");
  }

  private describeRecipe(): string {
    return SUPPLIES.map((s) => `${this.stand.recipe.amountOf(s)} ${s}`).join(", ");
  }
}
