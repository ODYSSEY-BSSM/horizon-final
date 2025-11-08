import { create } from 'zustand';
import type { Team } from './types';

interface TeamStore {
  teams: Record<number, Team>;
  setTeam: (team: Team) => void;
  removeTeam: (id: number) => void;
}

export const useTeamStore = create<TeamStore>((set) => ({
  teams: {},
  setTeam: (team) =>
    set((state) => ({
      teams: {
        ...state.teams,
        [team.id]: team,
      },
    })),
  removeTeam: (id) =>
    set((state) => {
      const newTeams = { ...state.teams };
      delete newTeams[id];
      return { teams: newTeams };
    }),
}));
