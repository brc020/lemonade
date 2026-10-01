import { Inventory, Market, Supplies } from "./inventory";

export class LemonadeStand {
  money: number;
  inventory: Inventory;
  lemonade: number;
  price: number;
  recipe: Supplies;


  //constructor for lemonadestand game START
  constructor() {
    this.money = 20;
    this.inventory = new Inventory();
    this.lemonade = 0;
    this.price = 1;
    this.recipe = { cups: 1, ice: 3, lemons: 1, sugar: 1 };
  }


  //buy supplies at the start of the day, the inventory does the buying
  //and the stand pays for it
  //returns false and buys nothing if the stand can't afford the order
  buySupplies(market: Market, order: Supplies): boolean {
    const cost = this.inventory.buySupplies(market, order, this.money);
    if (cost < 0) {
      return false;
    }

    this.money = this.roundToCents(this.money - cost);
    return true;
  }


  //at the start of the day have the inventory turn as many ingredients as
  //possible into cups of lemonade
  //returns how many cups of lemonade were made
  makeLemonade(): number {
    const made = this.inventory.makeLemonade(this.recipe);
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


  //at the end of the day leftover ice melts and unsold lemonade is thrown out
  //returns how much of each was lost
  endDay(): { iceMelted: number; lemonadeWasted: number } {
    const lost = { iceMelted: this.inventory.meltIce(), lemonadeWasted: this.lemonade };
    this.lemonade = 0;
    return lost;
  }


  private roundToCents(amount: number): number {
    return Math.round(amount * 100) / 100;
  }
}
