import { create } from 'zustand';
import type { TeamApply } from '../types';

interface TeamApplyStore {
  applications: TeamApply[];
  setApplications: (applications: TeamApply[]) => void;
  updateApplication: (application: TeamApply) => void;
}

export const useTeamApplyStore = create<TeamApplyStore>((set) => ({
  applications: [],
  setApplications: (applications) => set({ applications }),
  updateApplication: (application) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === application.id ? application : app,
      ),
    })),
}));
