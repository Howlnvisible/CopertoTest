export function MenuListSkeleton() {
  return (
    <div role="status" aria-label="Загрузка меню" className="p-6">
      <span className="sr-only">Загружаем меню…</span>
      <div aria-hidden="true" className="space-y-4 motion-safe:animate-pulse">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-6 rounded-lg bg-foreground/2.5 p-4"
          >
            <div className="h-4 w-2/5 rounded bg-foreground/10" />
            <div className="h-4 w-1/5 rounded bg-foreground/10" />
            <div className="ml-auto h-7 w-24 rounded-full bg-foreground/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
