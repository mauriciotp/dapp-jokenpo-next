export enum Options {
  NONE,
  ROCK,
  PAPER,
  SCISSORS,
}

export type PlayedEvent = 'event Played(address indexed player, string result)'
