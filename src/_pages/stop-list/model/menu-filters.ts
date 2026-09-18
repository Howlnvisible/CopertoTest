import { shopSchema, type MenuItem, type Shop } from '@/entities/menu-item';

export type MenuFilters = {
  shop: Shop | null;
  status: MenuItem['status'] | null;
};

export function parseShopFilter(value: string | null): MenuFilters['shop'] {
  const result = shopSchema.safeParse(value);
  return result.success ? result.data : null;
}

export function parseStatusFilter(value: string | null): MenuFilters['status'] {
  return value === 'available' || value === 'stopped' ? value : null;
}

export function parseMenuFilters(params: URLSearchParams): MenuFilters {
  return {
    shop: parseShopFilter(params.get('shop')),
    status: parseStatusFilter(params.get('status')),
  };
}

export function filterMenuItems(
  items: MenuItem[],
  filters: MenuFilters,
): MenuItem[] {
  return items.filter(
    (item) =>
      (filters.shop === null || item.shop === filters.shop) &&
      (filters.status === null || item.status === filters.status),
  );
}
