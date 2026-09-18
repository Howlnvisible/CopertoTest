'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';

import { Button } from './button';

type DialogProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  returnFocusId: string;
  children: ReactNode;
};

export function Dialog({
  open,
  title,
  description,
  onClose,
  returnFocusId,
  children
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;

    const previousFocus = document.activeElement;
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-dialog-initial-focus]')?.focus();

    return () => {
      dialog.close();
      if (document.querySelector('dialog[open]')) return;
      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected &&
        !previousFocus.matches(':disabled')
      ) {
        previousFocus.focus();
        if (document.activeElement === previousFocus) return;
      }
      document.getElementById(returnFocusId)?.focus();
    };
  }, [open, returnFocusId]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md overflow-y-auto border-l border-foreground/10 bg-white p-6 text-foreground shadow-xl backdrop:bg-black/35"
    >
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h2 id={titleId} className="text-xl font-semibold">
            {title}
          </h2>
          <p id={descriptionId} className="mt-2 text-sm text-foreground/65">
            {description}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={onClose}
          aria-label="Закрыть панель"
          className="shrink-0 px-3"
        >
          ×
        </Button>
      </header>
      {children}
    </dialog>
  );
}
