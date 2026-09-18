'use client';

import type { MenuItem } from '@/entities/menu-item';
import { Dialog } from '@/shared/ui/dialog';
import { ToastViewport } from '@/shared/ui/toast';

import { useStopPanelStore } from '../model/stop-panel.store';
import { StopForm } from './stop-form';

export function StopPanel({ items }: { items: MenuItem[] }) {
  const selectedItemId = useStopPanelStore((state) => state.selectedItemId);
  const closePanel = useStopPanelStore((state) => state.closePanel);
  const item = items.find((current) => current.id === selectedItemId);

  return (
    <>
      <Dialog
        open={item !== undefined}
        title={
          item?.status === 'stopped' ? 'Изменить стоп' : 'Поставить в стоп-лист'
        }
        description={item?.name ?? ''}
        onClose={closePanel}
        returnFocusId="menu-heading"
      >
        {item && <StopForm key={item.id} item={item} onCancel={closePanel} />}
        {item && <ToastViewport />}
      </Dialog>
      {!item && <ToastViewport />}
    </>
  );
}
