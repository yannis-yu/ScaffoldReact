import { Tournament, Player, Team, Hero } from './dota';

export type RootTabParamList = {
  Teams: undefined;
  Tournaments: undefined;
  Heroes: undefined;
};

// This contains all possible routes for any stack navigator.
export type RootStackParamList = {
  // Team Stack
  TeamList: undefined;
  TeamDetails: { teamId: number };
  PlayerDetails: { accountId: number };

  // Tournament Stack
  TournamentList: undefined;
  TournamentDetails: { tournament: Tournament };
  MatchDetails: { matchId: number };

  // Hero Stack
  HeroList: undefined;
  HeroDetails: { hero: Hero };
};
