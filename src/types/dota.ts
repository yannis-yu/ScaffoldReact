export interface Team {
  team_id: number;
  name: string;
  rating: number;
  wins: number;
  losses: number;
  logo_url: string;
}

export interface TeamMatch {
  match_id: number;
  radiant: boolean;
  radiant_win: boolean;
  duration: number;
  start_time: number;
  opposing_team_name: string;
  opposing_team_logo: string;
}

export interface Player {
  account_id: number;
  name: string;
  avatarfull: string;
  is_current_team_member: boolean;
}

export interface PlayerDetails extends Player {
  profile: {
    personaname: string;
    avatarfull: string;
  };
  solo_competitive_rank: number;
  competitive_rank: number;
}

export interface RecentMatch {
  match_id: number;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  duration: number;
  start_time: number;
}

export interface PlayerHero {
  hero_id: string;
  games: number;
  win: number;
}

export interface Match {
  match_id: number;
  radiant_win: boolean;
  radiant_score: number;
  dire_score: number;
  duration: number;
  start_time: number;
  radiant_team: { name: string; logo_url: string };
  dire_team: { name: string; logo_url: string };
  players: MatchPlayer[];
}

export interface MatchPlayer {
  account_id: number;
  personaname: string;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  gold_per_min: number;
  xp_per_min: number;
  item_0: number;
  item_1: number;
  item_2: number;
  item_3: number;
  item_4: number;
  item_5: number;
}

export interface Tournament {
  leagueid: number;
  name: string;
  tier: string;
  start_timestamp: number;
}

export interface Hero {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: string;
  attack_type: string;
  roles: string[];
  img: string;
  icon: string;
  base_health: number;
  base_mana: number;
  base_armor: number;
  base_attack_min: number;
  base_attack_max: number;
  move_speed: number;
}
