import type { ReactNode } from 'react';

import { SHOP_LABELS, STOP_REASON_LABELS } from '../model/constants';
import type { MenuItem } from '../model/types';

type MenuItemRowProps = {
  item: MenuItem;
  isPending: boolean;
  actions?: ReactNode;
};

const untilFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

export function MenuItemRow({ item, isPending, actions }: MenuItemRowProps) {
  const stopped = item.status === 'stopped';

  return (
    <tr
      className={stopped ? 'bg-foreground/2.5 text-foreground/65' : ''}
      aria-busy={isPending}
    >
      <th scope="row" className="px-6 py-5 text-left font-medium">
        {item.name}
      </th>
      <td className="px-4 py-5">{SHOP_LABELS[item.shop]}</td>
      <td className="px-4 py-5 tabular-nums">{item.remaining} шт.</td>
      <td className="px-4 py-5">
        <span
          className={
            stopped
              ? 'inline-flex whitespace-nowrap rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent'
              : 'inline-flex whitespace-nowrap rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800'
          }
        >
          {stopped ? 'В стоп-листе' : 'В продаже'}
        </span>
        {isPending && (
          <span role="status" className="mt-2 block text-xs text-foreground/60">
            Сохраняется…
          </span>
        )}
      </td>
      <td className="px-4 py-5">
        {stopped ? (
          <div className="space-y-1.5">
            <span className="inline-block rounded-md bg-foreground/5 px-2 py-1 text-xs font-medium">
              {STOP_REASON_LABELS[item.stopReason]}
            </span>
            <p className="text-xs">
              {item.until === null ? (
                'До конца смены'
              ) : (
                <time dateTime={item.until}>
                  До {untilFormatter.format(new Date(item.until))}
                </time>
              )}
            </p>
          </div>
        ) : (
          <span aria-label="Стоп не установлен">—</span>
        )}
      </td>
      {actions !== undefined && <td className="px-4 py-5">{actions}</td>}
    </tr>
  );
}
