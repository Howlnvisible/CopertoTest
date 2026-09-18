import type { MenuItem } from '@/entities/menu-item';

import type { MenuItemChange } from './menu-item.mutations';

export function applyMenuItemChange(
  item: MenuItem,
  change: MenuItemChange
): MenuItem {
  if (item.id !== change.id) return item;

  return change.type === 'stop'
    ? {
        ...item,
        status: 'stopped',
        stopReason: change.input.reason,
        until: change.input.until
      }
    : { ...item, status: 'available', stopReason: null, until: null };
}

export function replaceMenuItem(
  items: MenuItem[],
  replacement: MenuItem,
): MenuItem[] {
  return items.map((item) => (item.id === replacement.id ? replacement : item));
}
