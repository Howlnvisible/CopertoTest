import 'server-only';

import type { MenuItem } from '@/entities/menu-item';

import { createMenuSeed } from './seed';

const processState = globalThis as typeof globalThis & {
  copertoMenuItems?: Map<string, MenuItem>;
};

function getStore(): Map<string, MenuItem> {
  processState.copertoMenuItems ??= new Map(
    createMenuSeed().map((item) => [item.id, item]),
  );

  return processState.copertoMenuItems;
}

export function listMenuItems(): MenuItem[] {
  return Array.from(getStore().values(), (item) => ({ ...item }));
}

export function getMenuItem(id: string): MenuItem | undefined {
  const item = getStore().get(id);
  return item ? { ...item } : undefined;
}

export function saveMenuItem(item: MenuItem): void {
  getStore().set(item.id, { ...item });
}
