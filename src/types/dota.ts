export interface Team {
  team_id: number;
  name: string;
  rating: number;
  wins: number;
  losses: number;
  logo_url: string;
}

export interface Player {
  account_id: number;
  name: string;
  avatarfull: string;
  is_current_team_member: boolean;
}

export interface Tournament {
  leagueid: number;
  name: string;
  tier: string;
  start_timestamp: number;
}
