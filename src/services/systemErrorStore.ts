import { create } from "zustand";

interface SystemErrorState {
  hasSystemError: boolean;
  pollingInterval: number; // in seconds
  setPollingInterval: (seconds: number) => void;
  setSystemError: (val: boolean) => void;
}

export const useSystemErrorStore = create<SystemErrorState>((set) => ({
  hasSystemError: false,
  pollingInterval: 10, // Default to 10 seconds in development
  setPollingInterval: (seconds) => set({ pollingInterval: seconds }),
  setSystemError: (val) => set({ hasSystemError: val }),
}));
