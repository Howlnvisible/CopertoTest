import { apiRequest } from '@/shared/api';

import {
  menuItemResponseSchema,
  menuItemsResponseSchema,
} from '../model/menu-item.schema';
import type { MenuItem, StopInput } from '../model/types';

export async function getMenuItems(signal?: AbortSignal): Promise<MenuItem[]> {
  const response = await apiRequest(
    '/api/menu-items',
    (value) => menuItemsResponseSchema.parse(value),
    { signal },
  );
  return response.data;
}

export async function stopMenuItem(
  id: string,
  input: StopInput,
): Promise<MenuItem> {
  const response = await apiRequest(
    `/api/menu-items/${encodeURIComponent(id)}/stop`,
    (value) => menuItemResponseSchema.parse(value),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  );
  return response.data;
}

export async function resumeMenuItem(id: string): Promise<MenuItem> {
  const response = await apiRequest(
    `/api/menu-items/${encodeURIComponent(id)}/resume`,
    (value) => menuItemResponseSchema.parse(value),
    { method: 'POST' },
  );
  return response.data;
}
