'use client';

import { create } from 'zustand';

type StopPanelStore = {
  selectedItemId: string | null;
  openPanel: (id: string) => void;
  closePanel: () => void;
  closePanelFor: (id: string) => void;
};

export const useStopPanelStore = create<StopPanelStore>((set) => ({
  selectedItemId: null,
  openPanel: (id) => set({ selectedItemId: id }),
  closePanel: () => set({ selectedItemId: null }),
  closePanelFor: (id) =>
    set((state) =>
      state.selectedItemId === id ? { selectedItemId: null } : state
    ),
}));
