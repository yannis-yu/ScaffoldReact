import axios from 'axios';

const API_URL = 'https://api.opendota.com/api';
const CDN_URL = 'https://cdn.cloudflare.steamstatic.com';

export const getTeams = () => {
  return axios.get(`${API_URL}/teams`);
};

export const getTeamById = (teamId: number) => {
  return axios.get(`${API_URL}/teams/${teamId}`);
};

export const getTeamPlayers = (teamId: number) => {
  return axios.get(`${API_URL}/teams/${teamId}/players`);
};

export const getTeamMatches = (teamId: number) => {
  return axios.get(`${API_URL}/teams/${teamId}/matches`);
};

export const getPlayerById = (accountId: number) => {
  return axios.get(`${API_URL}/players/${accountId}`);
};

export const getPlayerRecentMatches = (accountId: number) => {
  return axios.get(`${API_URL}/players/${accountId}/recentMatches`);
};

export const getPlayerHeroes = (accountId: number) => {
  return axios.get(`${API_URL}/players/${accountId}/heroes`);
};

export const getMatchById = (matchId: number) => {
  return axios.get(`${API_URL}/matches/${matchId}`);
};

export const getTournaments = () => {
  return axios.get(`${API_URL}/leagues`);
};

export const getTournamentTeams = (leagueId: number) => {
  return axios.get(`${API_URL}/leagues/${leagueId}/teams`);
};

export const getHeroStats = () => {
  return axios.get(`${API_URL}/heroStats`);
};

// Helper to construct image URLs from the API's relative paths.
export const getSteamImageUrl = (path: string) => {
  return `${CDN_URL}${path}`;
};
