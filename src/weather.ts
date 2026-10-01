//the kinds of sky a day can have and how much each one helps sales
//1 = full demand, 0.4 = only 40% of the customers show up
const CONDITIONS = [
  { name: "sunny", demandFactor: 1 },
  { name: "cloudy", demandFactor: 0.75 },
  { name: "rainy", demandFactor: 0.4 },
];

//coldest and hottest a day can be, in °F
const MIN_TEMP = 55;
const MAX_TEMP = 100;

//the weather for one day, which decides how many customers want lemonade
export class Weather {
  temperature: number;
  condition: string;
  demandFactor: number;


  constructor(temperature: number, condition: string, demandFactor: number) {
    this.temperature = temperature;
    this.condition = condition;
    this.demandFactor = demandFactor;
  }


  //make a day with a random temperature and a random condition
  static random(): Weather {
    const temperature = MIN_TEMP + Math.floor(Math.random() * (MAX_TEMP - MIN_TEMP + 1));
    const condition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
    return new Weather(temperature, condition.name, condition.demandFactor);
  }


  //how many customers want a cup at the given price in dollars
  //hotter days bring more customers, rain and high prices turn them away
  demand(price: number): number {
    const base = (this.temperature - 40) * 1.5 * this.demandFactor;
    const priceFactor = Math.max(0, 1.5 - price / 2);
    const luck = 0.9 + Math.random() * 0.2;
    return Math.round(base * priceFactor * luck);
  }


  //text to show the player, like "88°F and sunny"
  describe(): string {
    return `${this.temperature}°F and ${this.condition}`;
  }
}
