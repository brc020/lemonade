import { Weather } from "./weather";

//how many days one run of the game lasts
const TOTAL_DAYS = 15;

//keeps track of what day it is and what the weather is that day
export class Calendar {
  day: number;
  totalDays: number;
  weather: Weather;


  //the game starts on day 1 with random weather
  constructor() {
    this.day = 1;
    this.totalDays = TOTAL_DAYS;
    this.weather = Weather.random();
  }


  //move to the next day and pick new weather for it
  //returns false and changes nothing if the last day is already finished
  nextDay(): boolean {
    if (this.isOver()) {
      return false;
    }

    this.day += 1;
    if (!this.isOver()) {
      this.weather = Weather.random();
    }
    return true;
  }


  //true once all the days have been played
  isOver(): boolean {
    return this.day > this.totalDays;
  }


  //how many customers want a cup today at the given price in dollars
  //hotter and sunnier days bring more customers
  getDemand(price: number): number {
    return this.weather.demand(price);
  }


  //text to show the player, like "Day 3 of 15: 88°F and sunny"
  describe(): string {
    return `Day ${this.day} of ${this.totalDays}: ${this.weather.describe()}`;
  }
}
