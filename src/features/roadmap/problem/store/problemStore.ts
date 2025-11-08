import { create } from 'zustand';
import type { Problem } from '../types';

interface ProblemStore {
  problemsByRoadmap: Record<number, Problem[]>;
  setProblems: (roadmapId: number, problems: Problem[]) => void;
  addProblem: (roadmapId: number, problem: Problem) => void;
  updateProblem: (roadmapId: number, updatedProblem: Problem) => void;
}

export const useProblemStore = create<ProblemStore>((set) => ({
  problemsByRoadmap: {},
  setProblems: (roadmapId, problems) =>
    set((state) => ({
      problemsByRoadmap: {
        ...state.problemsByRoadmap,
        [roadmapId]: problems,
      },
    })),
  addProblem: (roadmapId, problem) =>
    set((state) => ({
      problemsByRoadmap: {
        ...state.problemsByRoadmap,
        [roadmapId]: [...(state.problemsByRoadmap[roadmapId] || []), problem],
      },
    })),
  updateProblem: (roadmapId, updatedProblem) =>
    set((state) => ({
      problemsByRoadmap: {
        ...state.problemsByRoadmap,
        [roadmapId]: (state.problemsByRoadmap[roadmapId] || []).map((p) =>
          p.id === updatedProblem.id ? updatedProblem : p,
        ),
      },
    })),
}));
