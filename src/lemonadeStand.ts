//amount of each supply, used for prices, orders and the recipe
export type Supplies = {
  cups: number;
  ice: number;
  lemons: number;
  sugar: number;
};

//anything that can give today's supply prices (the market)
export interface Market {
  getPrices(): Supplies;
}

export class LemonadeStand {
  money: number;
  cups: number;
  ice: number;
  lemons: number;
  sugar: number;
  lemonade: number;
  price: number;
  recipe: Supplies;


  //constructor for lemonadestand game START
  constructor() {
    this.money = 20;
    this.cups = 0;
    this.ice = 0;
    this.lemons = 0;
    this.sugar = 0;
    this.lemonade = 0;
    this.price = 1;
    this.recipe = { cups: 1, ice: 3, lemons: 1, sugar: 1 };
  }


  //buy supplies at the start of the day using the market's prices
  //returns false and buys nothing if the stand can't afford the order
  buySupplies(market: Market, order: Supplies): boolean {
    const prices = market.getPrices();
    const cost =
      order.cups * prices.cups +
      order.ice * prices.ice +
      order.lemons * prices.lemons +
      order.sugar * prices.sugar;

    if (cost > this.money) {
      return false;
    }

    this.money = this.roundToCents(this.money - cost);
    this.cups += order.cups;
    this.ice += order.ice;
    this.lemons += order.lemons;
    this.sugar += order.sugar;
    return true;
  }


  //turn as many ingredients as possible into cups of lemonade for the day
  //returns how many cups of lemonade were made
  makeLemonade(): number {
    const made = Math.min(
      Math.floor(this.cups / this.recipe.cups),
      Math.floor(this.ice / this.recipe.ice),
      Math.floor(this.lemons / this.recipe.lemons),
      Math.floor(this.sugar / this.recipe.sugar)
    );

    this.cups -= made * this.recipe.cups;
    this.ice -= made * this.recipe.ice;
    this.lemons -= made * this.recipe.lemons;
    this.sugar -= made * this.recipe.sugar;
    this.lemonade += made;
    return made;
  }


  //sell one cup of lemonade for the set price
  //returns false if there is no lemonade left to sell
  sellCup(): boolean {
    if (this.lemonade < 1) {
      return false;
    }

    this.lemonade -= 1;
    this.money = this.roundToCents(this.money + this.price);
    return true;
  }


  //ice melts at the end of the day, returns how much was lost
  endDay(): number {
    const melted = this.ice;
    this.ice = 0;
    return melted;
  }


  private roundToCents(amount: number): number {
    return Math.round(amount * 100) / 100;
  }
}
