import { create } from 'zustand';
import type { Roadmap, TeamRoadmap } from '../types';

type RoadmapStore = {
  roadmaps: Roadmap[];
  teamRoadmaps: TeamRoadmap[];
  setRoadmaps: (roadmaps: Roadmap[]) => void;
  setTeamRoadmaps: (teamRoadmaps: TeamRoadmap[]) => void;
  addRoadmap: (roadmap: Roadmap) => void;
  addTeamRoadmap: (roadmap: TeamRoadmap) => void;
};

export const useRoadmapStore = create<RoadmapStore>((set) => ({
  roadmaps: [],
  teamRoadmaps: [],
  setRoadmaps: (roadmaps) => set({ roadmaps }),
  setTeamRoadmaps: (teamRoadmaps) => set({ teamRoadmaps }),
  addRoadmap: (roadmap) => set((state) => ({ roadmaps: [...state.roadmaps, roadmap] })),
  addTeamRoadmap: (roadmap) => set((state) => ({ teamRoadmaps: [...state.teamRoadmaps, roadmap] })),
}));
