'use client';

import { useId } from 'react';

import type { MenuItem } from '@/entities/menu-item';
import { Button } from '@/shared/ui/button';

import { useMenuItemMutation } from '../model/menu-item.mutations';
import { useStopPanelStore } from '../model/stop-panel.store';

export function MenuItemActions({
  item,
  isPending
}: {
  item: MenuItem;
  isPending: boolean;
}) {
  const openPanel = useStopPanelStore((state) => state.openPanel);
  const mutation = useMenuItemMutation();
  const hintId = useId();

  if (item.status === 'available') {
    return (
      <Button
        variant="secondary"
        pending={isPending}
        onClick={() => openPanel(item.id)}
      >
        В стоп-лист
      </Button>
    );
  }

  return (
    <div className="flex min-w-44 flex-col items-start gap-2">
      <Button
        variant="secondary"
        pending={isPending}
        pendingLabel="Сохраняем…"
        disabled={item.remaining === 0}
        aria-describedby={item.remaining === 0 ? hintId : undefined}
        onClick={() => mutation.mutate({ type: 'resume', id: item.id })}
      >
        Вернуть в продажу
      </Button>
      {item.remaining === 0 && (
        <p id={hintId} className="text-xs text-foreground/65">
          Нельзя вернуть: остаток 0 шт.
        </p>
      )}
      <button
        type="button"
        disabled={isPending}
        onClick={() => openPanel(item.id)}
        className="rounded text-sm text-accent-strong underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        Изменить стоп
      </button>
    </div>
  );
}
