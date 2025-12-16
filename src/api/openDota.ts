import axios from 'axios';

const API_URL = 'https://api.opendota.com/api';

export const getTeams = () => {
  return axios.get(`${API_URL}/teams`);
};

export const getTeamById = (teamId: number) => {
  return axios.get(`${API_URL}/teams/${teamId}`);
};

export const getTeamPlayers = (teamId: number) => {
  return axios.get(`${API_URL}/teams/${teamId}/players`);
};

export const getTournaments = () => {
  return axios.get(`${API_URL}/leagues`);
};

export const getTournamentTeams = (leagueId: number) => {
  return axios.get(`${API_URL}/leagues/${leagueId}/teams`);
};
