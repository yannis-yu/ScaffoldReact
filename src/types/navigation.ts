import { Tournament } from './dota';

export type RootStackParamList = {
  TeamList: undefined;
  TeamDetails: { teamId: number };
  TournamentList: undefined;
  TournamentDetails: { tournament: Tournament };
};
