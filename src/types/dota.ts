export interface Team {
  team_id: number;
  name: string;
  rating: number;
  wins: number;
  losses: number;
}

export interface Tournament {
  leagueid: number;
  name: string;
  tier: string;
}
