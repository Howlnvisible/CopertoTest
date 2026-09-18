type MenuEmptyStateProps = {
  hasFilters: boolean;
  onResetFilters: () => void;
};

export function MenuEmptyState({
  hasFilters,
  onResetFilters,
}: MenuEmptyStateProps) {
  return (
    <div role="status" className="px-6 py-16 text-center">
      <h2 className="text-lg font-semibold">
        {hasFilters ? 'Ничего не найдено' : 'Позиций пока нет'}
      </h2>
      <p className="mt-2 text-sm text-foreground/65">
        {hasFilters
          ? 'Нет позиций, соответствующих выбранным цеху и статусу.'
          : 'Когда в меню появятся позиции, они отобразятся здесь.'}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-5 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}
