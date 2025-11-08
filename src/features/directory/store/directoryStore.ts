import { create } from 'zustand';
import type { Directory } from '../types';

interface DirectoryStore {
  directories: Directory[];
  setDirectories: (directories: Directory[]) => void;
  // TODO: Add more specific actions like add, update, delete if needed
}

export const useDirectoryStore = create<DirectoryStore>((set) => ({
  directories: [],
  setDirectories: (directories) => set({ directories }),
}));
