'use client';

import { useSearchParams } from 'next/navigation';

import { parseMenuFilters, type MenuFilters } from './menu-filters';

function updateFilters(patch: Partial<MenuFilters>) {
  const url = new URL(window.location.href);

  for (const key of ['shop', 'status'] as const) {
    const value = patch[key];
    if (value === undefined) continue;
    if (value === null) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  }
  if (url.href !== window.location.href) {
    window.history.pushState(null, '', url.pathname + url.search);
  }
}

export function useMenuFilters() {
  const searchParams = useSearchParams();
  const filters = parseMenuFilters(
    new URLSearchParams(searchParams.toString()),
  );

  return {
    filters,
    setShop: (shop: MenuFilters['shop']) => updateFilters({ shop }),
    setStatus: (status: MenuFilters['status']) => updateFilters({ status }),
    resetFilters: () => updateFilters({ shop: null, status: null }),
  };
}
