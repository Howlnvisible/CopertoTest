import { queryOptions } from '@tanstack/react-query';

import { getMenuItems } from './menu-items.api';

export const menuItemsKeys = {
  all: ['menu-items'] as const,
  list: () => [...menuItemsKeys.all, 'list'] as const,
};

export function menuItemsQueryOptions() {
  return queryOptions({
    queryKey: menuItemsKeys.list(),
    queryFn: ({ signal }) => getMenuItems(signal),
    staleTime: 30000,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
