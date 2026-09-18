import { SHOPS, SHOP_LABELS } from '@/entities/menu-item';

import {
  parseShopFilter,
  parseStatusFilter,
  type MenuFilters,
} from '../model/menu-filters';

type MenuFiltersProps = {
  filters: MenuFilters;
  onShopChange: (shop: MenuFilters['shop']) => void;
  onStatusChange: (status: MenuFilters['status']) => void;
};

const selectClassName =
  'mt-2 block w-full rounded-lg border border-foreground/20 bg-white px-3 py-2.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export function MenuFilters({
  filters,
  onShopChange,
  onStatusChange,
}: MenuFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 border-b border-foreground/10 px-6 py-5">
      <label className="w-full text-sm font-medium sm:w-56">
        Цех
        <select
          value={filters.shop ?? ''}
          onChange={(event) =>
            onShopChange(parseShopFilter(event.target.value))
          }
          className={selectClassName}
        >
          <option value="">Все цеха</option>
          {SHOPS.map((shop) => (
            <option key={shop} value={shop}>
              {SHOP_LABELS[shop]}
            </option>
          ))}
        </select>
      </label>
      <label className="w-full text-sm font-medium sm:w-56">
        Статус
        <select
          value={filters.status ?? ''}
          onChange={(event) =>
            onStatusChange(parseStatusFilter(event.target.value))
          }
          className={selectClassName}
        >
          <option value="">Все статусы</option>
          <option value="available">В продаже</option>
          <option value="stopped">В стоп-листе</option>
        </select>
      </label>
    </div>
  );
}
