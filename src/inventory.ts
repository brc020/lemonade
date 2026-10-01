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

//the supplies the stand owns, handles buying them and using them up
export class Inventory {
  cups: number;
  ice: number;
  lemons: number;
  sugar: number;


  //the inventory starts out empty
  constructor() {
    this.cups = 0;
    this.ice = 0;
    this.lemons = 0;
    this.sugar = 0;
  }


  //buy supplies using the market's prices and add them to the inventory
  //money is how much the buyer has to spend
  //returns what the order cost, or -1 and buys nothing if it costs too much
  buySupplies(market: Market, order: Supplies, money: number): number {
    const prices = market.getPrices();
    const cost = this.roundToCents(
      order.cups * prices.cups +
      order.ice * prices.ice +
      order.lemons * prices.lemons +
      order.sugar * prices.sugar
    );

    if (cost > money) {
      return -1;
    }

    this.cups += order.cups;
    this.ice += order.ice;
    this.lemons += order.lemons;
    this.sugar += order.sugar;
    return cost;
  }


  //use up ingredients to make as many cups of lemonade as the recipe allows
  //returns how many cups of lemonade were made
  makeLemonade(recipe: Supplies): number {
    const made = Math.min(
      Math.floor(this.cups / recipe.cups),
      Math.floor(this.ice / recipe.ice),
      Math.floor(this.lemons / recipe.lemons),
      Math.floor(this.sugar / recipe.sugar)
    );

    this.cups -= made * recipe.cups;
    this.ice -= made * recipe.ice;
    this.lemons -= made * recipe.lemons;
    this.sugar -= made * recipe.sugar;
    return made;
  }


  //all the ice melts, returns how much was lost
  meltIce(): number {
    const melted = this.ice;
    this.ice = 0;
    return melted;
  }


  private roundToCents(amount: number): number {
    return Math.round(amount * 100) / 100;
  }
}
