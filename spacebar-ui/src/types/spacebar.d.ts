export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: "Mutation";
  savePlayer: Scalars["ID"];
};

export type MutationSavePlayerArgs = {
  player: NewPlayer;
};

export type NewPlayer = {
  name: Scalars["String"];
  score: Scalars["Int"];
};

export type Player = {
  __typename?: "Player";
  id: Scalars["String"];
  name: Scalars["String"];
  score: Scalars["Int"];
};

export type Query = {
  __typename?: "Query";
  getTopPlayers: Array<Player>;
};

export type QueryGetTopPlayersArgs = {
  numPlayers: Scalars["Int"];
};
