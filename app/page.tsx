import { Suspense } from 'react';

import { MenuListSkeleton, StopListPage } from '@/_pages/stop-list';

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8">
      <header>
        <p className="text-xs font-semibold tracking-widest text-accent uppercase">
          Управление меню
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Стоп лист кухни
        </h1>
        <p className="mt-3 text-base text-foreground/65">
          Позиции текущей смены, остатки и доступность для продажи.
        </p>
      </header>
      <Suspense
        fallback={
          <div className="mt-8 overflow-hidden rounded-2xl border border-foreground/10 bg-white">
            <MenuListSkeleton />
          </div>
        }
      >
        <StopListPage />
      </Suspense>
    </main>
  );
}
