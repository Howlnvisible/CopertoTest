'use client';

import { useQuery } from '@tanstack/react-query';

import { menuItemsQueryOptions } from '@/entities/menu-item';

import { filterMenuItems } from '../model/menu-filters';
import { useMenuFilters } from '../model/use-menu-filters';

import { MenuFilters } from './menu-filters';
import { MenuList } from './menu-list';
import { MenuListSkeleton } from './menu-list-skeleton';

export function StopListPage() {
  const { filters, setShop, setStatus, resetFilters } = useMenuFilters();
  const { data, error, isPending, isFetching, isPaused, refetch } = useQuery(
    menuItemsQueryOptions(),
  );

  const filteredItems =
    data === undefined ? undefined : filterMenuItems(data, filters);
  const hasFilters = filters.shop !== null || filters.status !== null;

  return (
    <section
      aria-label="Меню смены"
      className="mt-8 overflow-hidden rounded-2xl border border-foreground/10 bg-white"
    >
      <div className="flex items-center justify-between gap-4 border-b border-foreground/10 px-6 py-5">
        <h2 className="font-semibold">Меню смены</h2>
        <span role="status" className="text-sm text-foreground/60">
          {isFetching && data !== undefined
            ? 'Обновляем меню…'
            : data !== undefined
              ? `Позиций: ${filteredItems?.length} из ${data.length}`
              : error
                ? 'Меню недоступно'
                : 'Загрузка меню'}
        </span>
      </div>

      <MenuFilters
        filters={filters}
        onShopChange={setShop}
        onStatusChange={setStatus}
      />

      {isPaused && (
        <p
          role="status"
          className="border-b border-foreground/10 px-6 py-4 text-sm text-foreground/70"
        >
          Нет соединения. Загрузка продолжится после восстановления сети.
        </p>
      )}

      {error && (
        <div className="border-b border-accent/15 bg-accent/5 px-6 py-5">
          <div role="alert">
            <h3 className="font-medium text-accent">
              {data === undefined
                ? 'Не удалось загрузить меню'
                : 'Не удалось обновить меню'}
            </h3>
            <p className="mt-1 text-sm text-accent">{error.message}</p>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching || isPaused}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFetching && (
              <span
                aria-hidden="true"
                className="size-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin"
              />
            )}
            {isFetching ? 'Загружаем…' : 'Повторить'}
          </button>
        </div>
      )}

      {isPending && <MenuListSkeleton />}
      {filteredItems !== undefined && (
        <MenuList
          items={filteredItems}
          hasFilters={hasFilters}
          onResetFilters={resetFilters}
        />
      )}
    </section>
  );
}
