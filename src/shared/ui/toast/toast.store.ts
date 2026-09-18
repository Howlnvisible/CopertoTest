'use client';

import { create } from 'zustand';

type Toast = { id: string; message: string };
type ToastStore = {
  toasts: Toast[];
  addError: (message: string) => void;
  dismiss: (id: string) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addError: (message) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message }].slice(-3)
    })),
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    })),
}));
