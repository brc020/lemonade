const CONDITIONS = [
  { name: "sunny", demandFactor: 1.0 },
  { name: "cloudy", demandFactor: 0.75 },
  { name: "rainy", demandFactor: 0.4 },
] as const;

const MIN_TEMP = 55;
const MAX_TEMP = 100;

/** One day's weather, which determines how many customers want lemonade. */
export class Weather {
  constructor(
    readonly temperature: number,
    readonly condition: string,
    private readonly demandFactor: number,
  ) {}

  static random(): Weather {
    const temperature = MIN_TEMP + Math.floor(Math.random() * (MAX_TEMP - MIN_TEMP + 1));
    const condition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
    return new Weather(temperature, condition.name, condition.demandFactor);
  }

  /**
   * Number of customers willing to buy at the given price.
   * Hotter days bring more customers; higher prices turn them away.
   */
  demand(priceCents: number): number {
    const base = (this.temperature - 40) * 1.5 * this.demandFactor;
    const priceFactor = Math.max(0, 1.5 - priceCents / 200);
    const noise = 0.9 + Math.random() * 0.2;
    return Math.round(base * priceFactor * noise);
  }

  describe(): string {
    return `${this.temperature}°F and ${this.condition}`;
  }
}
