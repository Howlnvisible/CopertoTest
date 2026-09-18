'use client';

import { useToastStore } from './toast.store';

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 rounded-xl border border-accent/30 bg-white p-4 shadow-lg"
        >
          <p role="alert" className="flex-1 text-sm text-accent-strong">
            {toast.message}
          </p>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="Закрыть уведомление"
            className="rounded px-2 text-foreground/60 focus-visible:outline-2 focus-visible:outline-accent"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
